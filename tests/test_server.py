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
if __name__=='__main__':unittest.main()
