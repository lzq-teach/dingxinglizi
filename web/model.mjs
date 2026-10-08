export const VERSION=1;
const o=(value,label,description='')=>({value,label,description});
export const has=(a,v)=>Array.isArray(a)&&a.includes(v);
export const isAI=d=>has(d.types,'agent')||has(d.features,'ai');
export const isPayment=d=>has(d.features,'payment')||(has(d.types,'mini')&&has(d.miniServices,'pay'));
export const hasExternal=d=>isAI(d)||isPayment(d)||has(d.features,'sync')||has(d.features,'notifications')||has(d.types,'mini')||has(d.types,'automation');
export const fields=[
 {id:'types',step:0,label:'产品类型',required:true,kind:'multi',cards:true,options:[o('admin','后台系统'),o('agent','Agent / AI 助手'),o('web','网站 / Web 应用'),o('mini','微信小程序'),o('desktop','桌面软件'),o('mobile','手机 App'),o('automation','自动化工具'),o('other','其他 / 待定')]},
 {id:'depth',step:0,label:'交付目标',required:true,kind:'single',cards:true,options:[o('prototype','交互原型','页面与操作，数据可模拟'),o('demo','系统 Demo','前后台、接口和数据联动'),o('launch','上线版本','真实集成、验证与部署'),o('advice','待推荐','先评估范围与取舍')]},
 {id:'goal',step:0,label:'业务目标',required:true,kind:'textarea',placeholder:'给谁用，解决什么问题',max:2000},
 {id:'name',step:0,label:'项目名称',kind:'text',placeholder:'项目名称',max:100},
 {id:'stage',step:1,label:'项目阶段',kind:'single',options:[o('new','从零开始'),o('existing','已有项目迭代'),o('replace','替换旧系统'),o('unsure','待定')]},
 {id:'audience',step:1,label:'使用人群',kind:'multi',options:[o('self','个人'),o('team','内部团队'),o('customers','消费者 / 客户'),o('companies','企业 / 商户'),o('public','公众访客'),o('unsure','待定')]},
 {id:'roles',step:1,label:'用户角色',kind:'multi',options:[o('owner','超级管理员'),o('ops','运营'),o('staff','员工'),o('customer','普通用户'),o('merchant','商家 / 门店负责人'),o('reviewer','审核人员'),o('finance','财务'),o('suggest','待推荐')]},
 {id:'roleRules',step:1,label:'角色分工',kind:'textarea',placeholder:'如：员工只处理本人任务；店长可分配本店任务'},
 {id:'features',step:1,label:'首版功能',kind:'multi',options:[o('accounts','账号与权限'),o('crud','数据管理'),o('orders','订单 / 交易'),o('payment','支付 / 退款'),o('booking','预约 / 排班'),o('approval','审批'),o('search','搜索 / 筛选'),o('files','文件 / 图片'),o('notifications','消息提醒'),o('reports','报表 / 导出'),o('ai','AI 能力'),o('sync','第三方联动'),o('other','其他')]},
 {id:'flow',step:1,label:'核心流程',kind:'textarea',placeholder:'如：客户预约 → 店长分配 → 员工服务 → 客户确认'},
 {id:'rules',step:1,label:'业务规则',kind:'textarea',placeholder:'如：取消预约须提前 2 小时'},
 {id:'excluded',step:1,label:'不做 / 延后',kind:'textarea',placeholder:'本次不需要的功能'},
 {id:'scope',step:2,label:'数据可见范围',kind:'single',when:d=>has(d.features,'accounts')||has(d.types,'admin')||has(d.audience,'companies'),options:[o('own','仅本人'),o('org','所属团队 / 门店'),o('tenant','企业间严格隔离'),o('shared','团队共享'),o('unsure','待确认')]},
 {id:'adminWork',step:2,label:'后台主要工作',kind:'multi',when:d=>has(d.types,'admin'),options:[o('records','录入查询'),o('workflow','分配审批'),o('config','配置发布'),o('analysis','经营分析'),o('suggest','待推荐')]},
 {id:'agentJob',step:2,label:'Agent 任务',kind:'multi',when:isAI,options:[o('qa','知识问答'),o('generate','内容生成'),o('analysis','资料分析'),o('tools','操作工具'),o('workflow','多步任务'),o('suggest','待推荐')]},
 {id:'knowledge',step:2,label:'信息来源',kind:'multi',when:isAI,options:[o('input','当次输入'),o('docs','文件 / 知识库'),o('web','公开网络'),o('private','业务系统 / 私有数据'),o('unsure','待定')]},
 {id:'autonomy',step:2,label:'执行权限',kind:'single',when:d=>isAI(d)||has(d.types,'automation'),options:[o('suggest','只提供建议'),o('confirm','人工确认后执行'),o('bounded','约定范围内自动执行'),o('unsure','待确认')]},
 {id:'quality',step:2,label:'Agent 验收重点',kind:'multi',when:isAI,options:[o('accuracy','准确性与依据'),o('completion','任务完成率'),o('latency','响应速度'),o('cost','调用成本'),o('privacy','数据隐私'),o('unsure','待推荐')]},
 {id:'trigger',step:2,label:'触发方式',kind:'multi',when:d=>has(d.types,'automation'),options:[o('manual','手动'),o('schedule','定时'),o('event','消息 / 事件'),o('batch','批量文件'),o('unsure','待定')]},
 {id:'platform',step:2,label:'目标系统',kind:'multi',when:d=>has(d.types,'desktop')||has(d.types,'mobile'),options:[o('mac','macOS'),o('win','Windows'),o('linux','Linux'),o('ios','iOS'),o('android','Android'),o('unsure','待推荐')]},
 {id:'offline',step:2,label:'离线使用',kind:'single',when:d=>has(d.types,'desktop')||has(d.types,'mobile'),options:[o('yes','核心功能可离线'),o('no','仅联网使用'),o('unsure','待定')]},
 {id:'distribution',step:2,label:'安装方式',kind:'single',when:d=>has(d.types,'desktop')||has(d.types,'mobile'),options:[o('local','仅本机'),o('internal','内部安装包'),o('store','应用商店'),o('unsure','待推荐')]},
 {id:'miniServices',step:2,label:'微信能力',kind:'multi',when:d=>has(d.types,'mini'),options:[o('login','微信登录'),o('phone','手机号授权'),o('pay','微信支付'),o('notice','订阅消息'),o('location','位置 / 地图'),o('share','分享'),o('unsure','待推荐')]},
 {id:'webFocus',step:2,label:'网站用途',kind:'single',when:d=>has(d.types,'web'),options:[o('brand','品牌展示 / 获客'),o('content','内容阅读'),o('app','在线业务'),o('portal','内部门户'),o('unsure','待定')]},
 {id:'paymentRules',step:2,label:'交易场景',kind:'multi',when:isPayment,options:[o('single','单笔付款'),o('refund','取消 / 退款'),o('partial','部分退款'),o('group','合并付款 / 拆单'),o('subscription','周期付费'),o('unsure','待确认')]},
 {id:'integration',step:2,label:'外部服务接入',kind:'single',when:hasExternal,options:[o('mock','先模拟'),o('real','必须真实接入'),o('mixed','部分真实接入'),o('unsure','待推荐')]},
 {id:'accessReady',step:2,label:'平台账号 / 接口',kind:'single',when:hasExternal,options:[o('ready','已就绪'),o('partial','部分就绪'),o('none','未准备'),o('unsure','待确认')]},
 {id:'example',step:2,label:'典型输入与预期结果',kind:'textarea',placeholder:'如：输入一份订单表 → 按门店汇总金额；附一条成功和失败的例子'},
 {id:'acceptance',step:2,label:'验收场景',kind:'textarea',placeholder:'如：切换三个角色走完一次预约流程'},
 {id:'customization',step:3,label:'开发方式',kind:'single',options:[o('reuse','优先现成方案'),o('partial','局部定制'),o('custom','重点定制（备注）')]},
 {id:'priority',step:3,label:'首要目标',kind:'single',options:[o('speed','交付速度'),o('visual','视觉与体验'),o('business','业务闭环'),o('reliability','可靠性'),o('cost','控制成本'),o('suggest','待推荐')]},
 {id:'volume',step:3,label:'初期用户规模',kind:'single',options:[o('personal','个人 / 几人'),o('small','百人以内'),o('medium','百人至万人'),o('large','万人以上'),o('unknown','待估')]},
 {id:'growth',step:3,label:'每日新增数据',kind:'single',options:[o('low','几十条以内'),o('moderate','几十至几千条'),o('high','数万条以上'),o('unknown','待估')]},
 {id:'data',step:3,label:'数据类型',kind:'multi',options:[o('demo','演示数据'),o('public','公开信息'),o('business','业务数据'),o('personal','个人信息'),o('sensitive','财务 / 机密'),o('legacy','旧数据导入')]},
 {id:'hosting',step:3,label:'运行环境',kind:'single',options:[o('local','本机'),o('private','内网 / 私有环境'),o('cloud','云端'),o('existing','已有服务器'),o('suggest','待推荐')]},
 {id:'budget',step:3,label:'每月运行预算',kind:'single',options:[o('free','尽量零成本'),o('low','500 元以内'),o('mid','500–2,000 元'),o('high','2,000 元以上'),o('estimate','待估')]},
 {id:'deadline',step:3,label:'交付节奏',kind:'single',options:[o('fast','尽快看第一版'),o('week','一周左右看 Demo'),o('quality','质量优先'),o('date','指定日期（备注）')]},
 {id:'style',step:3,label:'视觉风格',kind:'single',options:[o('clean','简洁专业'),o('bright','明亮亲和'),o('tech','科技感'),o('existing','沿用现有设计'),o('suggest','待推荐')]},
 {id:'references',step:3,label:'参考产品',kind:'textarea',placeholder:'参考链接与喜欢的部分'},
 {id:'resources',step:3,label:'已有资料',kind:'textarea',placeholder:'代码目录或仓库、接口文档、样例数据的位置；不要填写密码或密钥'},
 {id:'constraints',step:3,label:'已有条件 / 技术限制',kind:'textarea',placeholder:'已有代码、必须复用的接口、部署限制等'},
 {id:'collaboration',step:3,label:'参与方式',kind:'single',options:[o('milestones','关键节点看结果'),o('visual','先看样板 / 原型'),o('delegate','只做关键决定'),o('together','一起讨论方案')]},
 {id:'notes',step:3,label:'补充说明',kind:'textarea',placeholder:'其他功能、具体日期或特殊要求'}
];
export const blank=()=>Object.fromEntries(fields.map(f=>[f.id,f.kind==='multi'?[]:'']));
export const visible=(f,d)=>!f.when||f.when(d);
export const answered=v=>Array.isArray(v)?v.length>0:typeof v==='string'&&v.trim().length>0;
export function activeData(d){return Object.fromEntries(fields.filter(f=>visible(f,d)).map(f=>[f.id,d[f.id]??(f.kind==='multi'?[]:'')]))}
export function label(id,v){const f=fields.find(f=>f.id===id);if(!f)return '';return Array.isArray(v)?v.map(x=>label(id,x)).join('、'):f.options?.find(x=>x.value===v)?.label||String(v||'')}
export const validate=d=>fields.filter(f=>f.required&&!answered(d[f.id])).map(f=>({id:f.id,message:`请填写${f.label}`}));
export function normalize(input){if(!input||typeof input!=='object'||Array.isArray(input))throw Error('项目格式不正确');const d=blank();for(const f of fields){const v=input[f.id];if(v===undefined)continue;if(f.kind==='multi'){if(!Array.isArray(v)||v.length>f.options.length||v.some(x=>typeof x!=='string'||!f.options.some(o=>o.value===x)))throw Error(`${f.label}含无效选项`);d[f.id]=[...new Set(v)]}else{if(typeof v!=='string'||v.length>(f.max||5000))throw Error(`${f.label}格式或长度无效`);if(f.options&&v&&!f.options.some(o=>o.value===v))throw Error(`${f.label}含无效选项`);d[f.id]=v}}return d}
export function recommend(raw){const d={...blank(),...activeData(raw)},ai=isAI(d),pay=isPayment(d),auto=has(d.types,'automation'),legacy=['existing','replace'].includes(d.stage)||has(d.data,'legacy');
 let mode='范围与方案确认',first='先提出核心流程与交付范围，确认关键分歧。';
 if(d.depth==='prototype'){mode='原型共创';first='先做代表性页面与可点击流程，确认业务和视觉。'}
 if(d.depth==='demo'){mode='业务闭环优先';first='先让核心流程贯穿角色、界面、API 和持久化，再扩展功能。'}
 if(d.depth==='launch'){mode='上线交付';first='确认发布范围和依赖，完成实际集成及对应的上线验证。'}
 if(ai){mode=d.depth==='launch'?'Agent 评测与上线':'Agent 效果验证优先';first='先以代表性输入验证效果、失败处理与工具边界，再扩展界面和能力。'}
 else if(auto){mode='自动化流程验证';first='先跑通一项任务，验证重复触发、重试与中断恢复。'}
 else if(has(d.types,'web')&&['brand','content'].includes(d.webFocus)&&!pay){mode='内容与体验共创';first='先确认内容层级和代表性页面，验证阅读与转化路径。'}
 if(legacy)first='先核对现有系统与应保留行为。'+first;
 const checks=[],architecture=[d.customization==='custom'?'按明确的定制范围评估实现，通用能力仍优先复用。':'默认效率优先：先评估成熟项目、模板和组件，用关键流程验证后做最小改造；不适配的部分再定制。'],pending=[];
 if(ai){checks.push('用代表性样本评估准确性、依据和任务完成情况，保留失败样本。');architecture.push('划分模型、知识源、工具和评测边界，再判断是否需要检索、记忆或多 Agent。');if(!d.autonomy||d.autonomy==='unsure')pending.push('Agent 可执行哪些动作，哪些需要人工确认？');if(!answered(d.knowledge)||has(d.knowledge,'unsure'))pending.push('允许使用哪些知识源，哪些数据不能发给模型？');if(has(d.agentJob,'tools')&&d.autonomy==='suggest')pending.push('已选择工具操作和只提供建议：是否仅生成操作方案？')}
 if(auto){checks.push('核对重复触发、部分成功、重试与恢复，避免重复执行。');architecture.push('按触发方式设计任务状态与重试；仅在规模需要时引入独立队列。')}
 if(has(d.types,'admin')){checks.push('列表、详情与操作使用一致权限；走通录入到处理结果。');architecture.push('围绕业务对象和权限复用列表、表单与后台组件。')}
 if(has(d.types,'mini')){checks.push('核对微信授权返回、弱网与前后台切换；上传和真机可用分别验收。');architecture.push('划定小程序、后台 API 与微信平台的能力边界，多端共用业务规则。')}
 if(has(d.types,'desktop')||has(d.types,'mobile')){checks.push('在目标设备检查安装、更新和本地数据；有离线需求时验证恢复同步。');architecture.push('根据目标系统、离线与硬件需求选择原生、跨平台或封装方案。');if(!answered(d.platform)||has(d.platform,'unsure'))pending.push('首版必须支持哪些设备与操作系统？')}
 if(has(d.types,'web')){checks.push('检查响应式、关键交互和刷新恢复；内容型站点按需要检查搜索发现。');architecture.push(['brand','content'].includes(d.webFocus)?'先判断静态内容是否足够，只为必要业务引入服务端。':'按公开内容、登录和业务写入需求确定前后端边界。')}
 if(d.types.length>1)checks.push('核对各端的保存、读取、状态和显示是否一致。');
 if(pay){checks.push('验证金额、重复提交、支付取消竞争及退款；按实际风险安排独立审核。');architecture.push('明确订单、交易与履约关系、幂等和历史快照。');if(!answered(d.paymentRules)||has(d.paymentRules,'unsure'))pending.push('支付、退款、超时与合并交易采用什么规则？')}
 if(d.scope==='tenant'||has(d.data,'sensitive'))checks.push('验证数据隔离和敏感信息边界，按上线要求核对审计与恢复。');
 if(legacy)checks.push('保护既有数据，验证兼容、迁移与恢复边界。');
 if(d.volume==='large'||d.growth==='high'){checks.push('以代表性数据和受限资源测量关键请求成本。');architecture.push('分开评估并发、历史数据、附件和外部调用成本，验证分页、索引与生命周期。')}
 if(d.depth==='prototype')checks.push('本轮确认流程与视觉；模拟服务不算真实集成证据。');
 if(d.depth==='demo')checks.push('核心数据持久化、演示环境可重置，明确真实与模拟服务。');
 if(d.depth==='launch')checks.push('绑定实际版本与环境，验证必要的备份恢复、真实集成与发布结果。');
 if(hasExternal(d)&&d.integration==='real'&&d.accessReady!=='ready')pending.push('真实接入所需的平台账号、资质或接口是否已就绪？');
 if(d.depth==='launch'&&d.integration==='mock')pending.push('哪些模拟服务必须在上线前替换为真实服务？');
 if(d.hosting==='local'&&(d.integration==='real'||has(d.knowledge,'web')))pending.push('本机运行是否允许联网调用外部服务？');
 if(d.roles.length>1&&!answered(d.roleRules))pending.push('明确各角色可查看的数据与可执行的操作。');
 if(!answered(d.example))pending.push('补一份典型输入及预期结果，作为开发与验收样例。');
 if(legacy&&!answered(d.resources))pending.push('提供现有代码、接口或数据资料的位置，核对可复用部分。');
 if(!answered(d.flow))pending.push('由助手提出主流程草案，核对实际业务。');
 if(!answered(d.rules)&&(pay||has(d.features,'booking')||has(d.features,'approval')))pending.push('确认数量口径、状态变化、取消和异常处理规则。');
 if(!answered(d.acceptance))pending.push('由助手提出验收场景，明确完成标准。');
 if(has(d.types,'other'))pending.push('根据业务目标推荐产品形态。');
 if(!d.depth||d.depth==='advice')pending.push('推荐本轮交付范围与取舍。');
 const participation={milestones:'关键节点集中看结果，常规实现自主推进。',visual:'先看样板与原型，再扩展；必要的技术验证可先行。',delegate:'助手推荐方案，用户决定实质业务取舍和新增授权。',together:'方案阶段一起讨论有效选项，确认后集中实现。'};
 const priorities={speed:'先交付最小有用闭环，保留必要验证，延期功能单列。',visual:'先验证样板与真实形态内容，再复用设计。',business:'优先角色与数据之间的完整流转。',reliability:'先验证高后果失败路径，再扩展功能。',cost:'先估算部署、存储和外部调用成本。'};
 return {mode,first,you:['业务目标与关键规则','范围取舍与实际体验反馈'],agent:['架构、实现与相关验证','可运行交付和限制说明'],checks:[...new Set(checks)],architecture:[...new Set(architecture)],pending:[...new Set(pending)],participation:participation[d.collaboration]||'按项目风险设置确认点，普通实现细节由助手负责。',priority:priorities[d.priority]||'默认交付效率优先，复用成熟方案，保留必要业务验证。'};
}
export function brief(d){const p=recommend(d),items=fields.filter(f=>visible(f,d)&&answered(d[f.id]));return [`# ${d.name.trim()||'未命名项目'} · 项目简报`,'',`状态：${validate(d).length?'草稿，必填信息未完成':'必填信息已完成，业务细节见待确认项'}`,'','## 用户填写',...items.map(f=>`- ${f.label}：${label(f.id,d[f.id])}`),'','## 协作建议（由选项生成，尚非批准方案）',`- 方式：${p.mode}`,`- 首份成果：${p.first}`,`- 参与方式：${p.participation}`,`- 优先级：${p.priority}`,'','## 架构判断方向',...(p.architecture.length?p.architecture:['先结合目标确认业务关系、数据和运行边界。']).map(s=>'- '+s),'','## 验证关注点',...p.checks.map(s=>'- '+s),'','## 待确认',...(p.pending.length?p.pending:['暂无规则识别出的额外缺口，仍需结合实际业务核对。']).map(s=>'- '+s),'','## 执行要求','读取适用项目规则与 focused-delivery。区分用户选择、建议和待定项，提出适配本项目的技术架构、业务关系、实现范围与验收方案。只集中询问会实质改变业务、成本、权限或范围的问题，其余可逆细节自主处理。未填写不视为同意或不需要。','本表不授予真实交易、外部发信、删除数据或公开发布的执行权限。'].join('\n')}

export function stepProgress(d,step){const fs=fields.filter(f=>f.step===step&&visible(f,d));return {filled:fs.filter(f=>answered(d[f.id])).length,total:fs.length}}
