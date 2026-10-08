import importlib.util, json, unittest, threading, urllib.request, urllib.error
from pathlib import Path
spec=importlib.util.spec_from_file_location('server',Path(__file__).resolve().parents[1]/'server.py')
m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m)
class ServerTests(unittest.TestCase):
 @classmethod
 def setUpClass(cls):
  cls.http=m.ThreadingHTTPServer(('127.0.0.1',0),m.Handler);m.PORT=cls.http.server_port
  cls.url=f'http://127.0.0.1:{m.PORT}';threading.Thread(target=cls.http.serve_forever,daemon=True).start()
 @classmethod
 def tearDownClass(cls): cls.http.shutdown();cls.http.server_close()
 def post(self,body,origin=None):
  req=urllib.request.Request(self.url+'/api/generate-agents',data=json.dumps(body).encode(),headers={'Content-Type':'application/json','Origin':origin or self.url,'X-Kickoff-Request':'1'})
  try:
   with urllib.request.urlopen(req) as r:return r.status,json.load(r)
  except urllib.error.HTTPError as e:return e.code,json.load(e)
 def test_cross_origin_rejected(self):self.assertEqual(self.post({'brief':'x'},'https://example.com')[0],403)
 def test_bad_input(self):self.assertEqual(self.post({'brief':2})[0],422)
 def test_single_generation(self):
  m.LOCK.acquire()
  try:self.assertEqual(self.post({'brief':'x'*30})[0],409)
  finally:m.LOCK.release()
 def test_model_failure_not_success(self):
  old=m.generate;m.generate=lambda _: (_ for _ in ()).throw(ValueError('生成失败'))
  try:
   status,data=self.post({'brief':'x'*30});self.assertEqual(status,422);self.assertNotIn('markdown',data)
  finally:m.generate=old
 def raw_post(self,headers,body=b'{}'):
  req=urllib.request.Request(self.url+'/api/generate-agents',data=body,headers=headers)
  try:
   with urllib.request.urlopen(req) as r:return r.status
  except urllib.error.HTTPError as e:return e.code
 def test_request_checks(self):
  base={'Content-Type':'application/json','Origin':self.url,'X-Kickoff-Request':'1'}
  self.assertEqual(self.raw_post({k:v for k,v in base.items() if k!='X-Kickoff-Request'}),403)
  self.assertEqual(self.raw_post({**base,'Content-Type':'text/plain'}),415)
  self.assertEqual(self.raw_post(base,b''),400)
 def test_static_files_revalidate(self):
  with urllib.request.urlopen(self.url+'/app.js') as r: self.assertEqual(r.headers.get('Cache-Control'),'no-cache')
 def test_foreign_host_rejected_for_head_and_get(self):
  for method in ('GET','HEAD'):
   req=urllib.request.Request(self.url+'/',method=method,headers={'Host':'evil.example:80'})
   with self.assertRaises(urllib.error.HTTPError) as cm: urllib.request.urlopen(req)
   self.assertEqual(cm.exception.code,403,method)
 def test_unexpected_value_error_not_leaked(self):
  old=m.generate;m.generate=lambda _: (_ for _ in ()).throw(UnicodeEncodeError('utf-8','x',0,1,'surrogates not allowed'))
  try:
   status,data=self.post({'brief':'x'*30});self.assertEqual(status,422);self.assertNotIn('surrogates',data['error'])
  finally:m.generate=old
 def test_status_hides_home_directory(self):
  with urllib.request.urlopen(self.url+'/api/status') as r: data=json.load(r)
  self.assertNotIn(str(m.Path.home())+'/',data['skill'])
if __name__=='__main__':unittest.main()
