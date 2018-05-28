// appConfig
var mBaseUrl = "http://192.168.1.249:91/api/gw/";
var rBaseUrl = "http://192.168.1.249:91/res/gw/";
var talent0 = "http://192.168.1.101:9008/api/";
var mediaServer = "http://192.168.1.101:9010/";
var getNewUrl = function(_string) {
	return mBaseUrl + "api/" + _string + "/api/";
};
var retNewUrl = function(_string) {
	return rBaseUrl + "res/" + _string + "/";
};
var apiAdds0 = getNewUrl("foundation");
var apiAdds1 = getNewUrl("organization");
var apiAdds3 = getNewUrl("information");
var apiAdds4 = getNewUrl("point");
var apiAdds5 = getNewUrl("democratic");
var apiAdds6 = getNewUrl("member");
var apiAdds7 = getNewUrl("event");
var apiAdds8 = getNewUrl("work");
var apiAdds9 = getNewUrl("formdatacenter");
var apiAddsa = getNewUrl("statistics");
var apiAddsb = retNewUrl("media");
var apiAddsc = getNewUrl("coterie");
var apiAddsd = getNewUrl("advertisement");
var apiAddsf = getNewUrl("finances");
var apiAddsg = getNewUrl("construction");
var apiAddsh = getNewUrl("pointmall");

app.constant("serverUrls", {
	//人才网
	getbannerlistbypage: talent0 + "webmanager/helpcentre/getbannerlistbypage", //分页获取banner
	addbanner: talent0 + "webmanager/helpcentre/addbanner", //增加banner
	deletebannerbyid: talent0 + "webmanager/helpcentre/deletebannerbyid", //删除banner
	banneropenclose: talent0 + "webmanager/helpcentre/banneropenclose", //开启和关闭
	updatebanner: talent0 + "webmanager/helpcentre/updatebanner", //修改banner
	getfriendlylinklistbypage: talent0 + "webmanager/helpcentre/getfriendlylinklistbypage", //分页获取友情链接
	addfriendlylink: talent0 + "webmanager/helpcentre/addfriendlylink", //新增友情链接
	deletefriendlylinkbyid: talent0 + "webmanager/helpcentre/deletefriendlylinkbyid", //删除友情链接
	updatefriendlylink: talent0 + "webmanager/helpcentre/updatefriendlylink", //修改友情链接
	getonlineconsultationlistbypage: talent0 + "webmanager/helpcentre/getonlineconsultationlistbypage", //分页获取区镇列表
	addonlineconsultation: talent0 + "webmanager/helpcentre/addonlineconsultation", //新增在线咨询
	updateonlineconsultation: talent0 + "webmanager/helpcentre/updateonlineconsultation", //修改在线咨询
	deleteonlineconsultationbyid: talent0 + "webmanager/helpcentre/deleteonlineconsultationbyid", //删除在线咨询
	gethelperlistbypage: talent0 + "webmanager/helpcentre/gethelperlistbypage", //分页获取常见问题
	deletehelperbyid: talent0 + "webmanager/helpcentre/deletehelperbyid", //删除常见问题
	addhelper: talent0 + "webmanager/helpcentre/addhelper", //新增常见问题
	updatehelper: talent0 + "webmanager/helpcentre/updatehelper", //修改常见问题
	addorupdatesingleinformation: talent0 + "webmanager/helpcentre/addorupdatesingleinformation", //编辑单页面
	getsingleinformation: talent0 + "webmanager/helpcentre/getsingleinformation", //获取单页面
	getannouncementslistbypage: talent0 + "webmanager/announcement/getannouncementslistbypage", //分页获取政策与公告
	addannouncements: talent0 + "webmanager/announcement/addannouncements", //新增政策与公告
	updateannouncements: talent0 + "webmanager/announcement/updateannouncements", //修改政策与公告
	deleteannouncementsbyid: talent0 + "webmanager/announcement/deleteannouncementsbyid", //删除政策与公告
	getbannerdetails: talent0 + "webmanager/helpcentre/getbannerdetails", //获取banner详情
	addcertification: talent0 + "webmanager/helpcentre/addcertification", //新增权威认证
	updatecertification: talent0 + "webmanager/helpcentre/updatecertification", // 修改权威认证
	getcertificationlistbypage: talent0 + "webmanager/helpcentre/getcertificationlistbypage", //分页获取权威认证
	deletecertification: talent0 + "webmanager/helpcentre/deletecertification", //删除权威认证
	getcommontaglist: talent0 + "webmanager/news/getcommontaglist", //标签列表
	addcommontag: talent0 + "webmanager/news/addcommontag", //新增标签
	updatecommontag:talent0+"webmanager/news/updatecommontag",//修改资讯标签
	deletecommontagbyid: talent0 + "webmanager/news/deletecommontagbyid", //删除标签
	getnewsarticlemanagelistbypage: talent0 + "webmanager/news/getnewsarticlemanagelistbypage", //分页获取资讯类容列表
	addnewsarticle: talent0 + "webmanager/news/addnewsarticle", //新增前沿资讯
	deletenewsarticlebyid: talent0 + "webmanager/news/deletenewsarticlebyid", //删除资讯
	updatenewsarticle: talent0 + "webmanager/news/updatenewsarticle", //修改资讯
	getnewsarticledetails: talent0 + "webmanager/news/getnewsarticledetails", //获取资讯详情
	getnewsarticleauditdetails:talent0+	"webmanager/news/getnewsarticleauditdetails",//资讯审核详情
	getnewsarticleauditlist: talent0 + "webmanager/news/getnewsarticleauditlist", //资讯审核列表
	newsarticleaudit: talent0 + "webmanager/news/newsarticleaudit", //审核资讯
	getnewsarticlepublishlist: talent0 + "webmanager/news/getnewsarticlepublishlist", //发布列表
	newsarticlepublishorclose: talent0 + "webmanager/news/newsarticlepublishorclose", //发布操作
	newsarticlesubmit: talent0 + "webmanager/news/newsarticlesubmit", //提交操作
	contentManagerListUrl: talent0 + "webmanager/train/training/content/list", //课程内容管理列表获取
	richTextFilesDomain: mediaServer, // 文件获取服务器地址
	contentManagerTypeListUrl: talent0 + "webmanager/train/traincategory/list", //课程类型列表获取 
	userLogin: talent0 + "webmanager/user/login", //用户登录
	imagecertUrl: talent0 + "webmanager/user/captcha/file/", //
	richTextFileUpLoad: mediaServer + "mediafile/richeditor/upload", // 文件上传
	richTextFileUpLoadResult: mediaServer + "mediafile/richeditor/result", // 文件上传结果
	richTextFilesManage: mediaServer + "mediafile/richeditor/myalbum", // 相册
	deleteTraincategorys: talent0 + "webmanager/train/traincategorys", //删除课程分类
	addTraincategory: talent0 + "webmanager/train/traincategory", //增加课程分类
	updateTraincategory: talent0 + "webmanager/train/traincategory", //更新课程分类
	commontagList: talent0 + "webmanager/talent/commontag/list", //获取人才标签
	fileUpload: mediaServer + "mediafile/api/upload", //图片上传

	pollbackaudit: talent0 + "webmanager/train/training/pollbackaudit", //课程内容 撤销、提交审核1 - 提交，2 - 撤销提交
	trainTraining: talent0 + "webmanager/train/training", //课程内容新增，修改，获取详情
	trainTrainings: talent0 + "webmanager/train/trainings", //课程内容删除

	trainingcharacter: talent0 + "webmanager/train/trainingcharacter", //新增/修改、详情章节
	trainingcharacters: talent0 + "webmanager/train/trainingcharacters", //删除章节
	trainingattachment: talent0 + "webmanager/train/trainingattachment", //新增培训课程资源
	useraccount: talent0 + "webmanager/user/account", //修改，添加，删除后台人员
	opencloseaccount: talent0 + "webmanager/user/opencloseaccount", //开启关闭账号

	updateTalentcommontag:talent0+"webmanager/talent/commontag",//更新人才标签
	addTalentCommontag: talent0 + "webmanager/talent/commontag", //新增标签
	deleteCommontags: talent0 + "webmanager/talent/commontags", //删除人才标签
	accountloginrecordList: talent0 + "webmanager/user/accountloginrecord/list", //分页获取登录记录

	getTrainingAuditList: talent0 + "webmanager/train/training/audit/list", //分页获取培训课程审核管理
	getAccounts: talent0 + "webmanager/user/accounts", //获取后台人员列表
	deleteAccount: talent0 + "webmanager/user/account", //删除后台人员
	opencloseaccount: talent0 + "webmanager/user/opencloseaccount", //开启和关闭账号
	addAccount: talent0 + "webmanager/user/account", //添加后台人员
	updateAccount: talent0 + "webmanager/user/account", //修改后台人员
	getPublishList: talent0 + "webmanager/train/training/publish/list", //分页获取发布管理列表
	trainingAudit: talent0 + "webmanager/train/training/audit", //培训课程审核
	trainingById: talent0 + "webmanager/train/training", //根据Id获取培训课程
	getTrainingcharacterList: talent0 + "webmanager/train/trainingcharacter/list", //分页获取课程章节
	trainingPublish: talent0 + "webmanager/train/training/publish", //发布课程

	modifypassword:talent0 + "webmanager/user/modifypassword",//自己修改密码
	getsmsauth:talent0 +"/webmanager/user/smsauth",//获取验证码

	adminmodifyaccount: talent0 + "webmanager/user/adminmodifyaccount", //超管重置后台人员密码
	talentList: talent0 + "webmanager/talent/talent/list", //分页获取人才信息
	openclosetalent: talent0 + "webmanager/talent/openclosetalent", //开启和关闭人才信息
	certificatestate: talent0 + "webmanager/talent/certificatestate", //认证人才信息
	deleteTalents: talent0 + "webmanager/talent/talents", //删除人才信息
	getTalentDetails: talent0 + "webmanager/talent/talent", //根据id获取详情






	browsestatisticslist:talent0+"webmanager/train/training/browsestatisticslist",//培训课程的统计列表
	statisticslist:talent0+"webmanager/news/statisticslist",//资讯统计列表
	gethomechartsdata:talent0+"webmanager/home/gethomechartsdata",//获取首页echar图数据
	gethomestatisticsdata:talent0+"webmanager/home/gethomestatisticsdata",//获取首页数据
	getnewsarticlepublishdetails:talent0+"webmanager/news/getnewsarticlepublishdetails",//根据id获取发布详情
	corporationDetail:talent0+"webmanager/corporation/detail",//根据id查询企业详情
	corporationCertificatestate:talent0+"webmanager/corporation/certificatestate",//企业的认证状态
	corporationOpenstate:talent0+"webmanager/corporation/openstate",//修改企业的开启和关闭状态
	deletecorporations:talent0+"webmanager/corporation/deletecorporations",//删除企业信息
	getCorporationList:talent0+"webmanager/corporation/list",//分页获取企业的信息
	getTalentRole: talent0 + "webmanager/user/roles", //获取用户角色
	trainingOpenclose: talent0 + "webmanager/train/training/openclose", //关闭和开启
	trainingcharacterGetById: talent0 + "webmanager/train/trainingcharacter", //根据Id获取课程章节





	residentLogin: apiAdds0 + "foundation/login", //居民登录
	uppassword: apiAdds0 + "foundation/uppassword", //更新密码
	resetpassword: apiAdds0 + "foundation/resetpassword", //重置密码
	getIdcardno: apiAdds0 + "foundation/getidcardno", //根据居民Id获取居民信息
	AddShopMember: apiAddsh + "pointmall/AddShopMember", //设置之成员新增
	getRole: apiAdds6 + "menubar/getrole", //获取用户下的角色列表
	GetShopBaseInfo: apiAddsh + "pointmall/GetShopBaseInfo", //获取店铺信息
	GetShopHomeStatisticsInfo: apiAddsh + "pointmall/GetShopHomeStatisticsInfo", //获取首页店铺统计信息
	GetStatistics: apiAddsh + "pointmall/statistics", //首页统计数据
	DeleteShopMemberById: apiAddsh + "pointmall/DeleteShopMemberById", //删除店铺成员
	UpdateShopMember: apiAddsh + "pointmall/UpdateShopMember", //修改店铺成员
	GetMyShopList: apiAddsh + "pointmall/GetMyShopList", //获取账户信息
	issubmit: apiAddsh + "pointmall/issubmit", //提交和撤销
	couponorderList: apiAddsh + "pointmall/couponorderlist", //订单列表
	UpdateShopBaseInfo: apiAddsh + "pointmall/UpdateShopBaseInfo", //修改店铺基本信息

	couponlist: apiAddsh + "pointmall/couponlist", //分页获取优惠券商品
	decoupon: apiAddsh + "pointmall/decoupon", //删除审核管理页面的商品
	addcoupon: apiAddsh + "pointmall/addcoupon", //新增优惠券商品
	decoupon: apiAddsh + "pointmall/decoupon", //删除优惠券

	getcoupont: apiAddsh + "pointmall/getcoupont", //根据Id获取优惠券详情
	upcoupon: apiAddsh + "pointmall/upcoupon", //修改优惠券
	GetOrderEvaluationListMerchant: apiAddsh + "pointmall/GetOrderEvaluationListMerchant", //评价列表
	GetOrderEvaluationDetailsById: apiAddsh + "pointmall/GetOrderEvaluationDetailsById", //通过Id获取评论详情
	OrderEvaluationReply: apiAddsh + "pointmall/OrderEvaluationReply", //回复评论

	GetShopMemberListByPage: apiAddsh + "pointmall/GetShopMemberListByPage", //获取店铺成员列表信息
	ChangeShopMemberState: apiAddsh + "pointmall/ChangeShopMemberState", //改变店铺成员状态
	GetShopMemberRoleListByPage: apiAddsh + "pointmall/GetShopMemberRoleListByPage", //分页获取权限设置
	GetShopMemberNameList: apiAddsh + "pointmall/GetShopMemberNameList", //权限设置成员列表
	AddShopMemberRole: apiAddsh + "pointmall/AddShopMemberRole", //权限设置新增
	UpdateShopMemberRole: apiAddsh + "pointmall/UpdateShopMemberRole", //权限设置修改

	decoupon: apiAddsh + "pointmall/decoupon", //删除审核管理页面的商品

	isshelf: apiAddsh + "pointmall/isshelf", //上下架

	UpdateShopMapInfo: apiAddsh + "pointmall/UpdateShopMapInfo", //编辑地图
	vercouponorder: apiAddsh + "pointmall/vercouponorder", //兑换优惠券
	getrecodecoupon: apiAddsh + "pointmall/getrecodecoupon", //优惠券

	creveryaccountclaimList: apiAddsh + "pointmall/creveryaccountclaim/list", //规则列表
	creveryaccountclaim: apiAddsh + "pointmall/creveryaccountclaim", //新增
	creveryaccountuseList: apiAddsh + "pointmall/creveryaccountuse/list", ////规则列表
	creveryaccountuse: apiAddsh + "pointmall/creveryaccountuse", //新增

	//商品统计
	statisticsCoupon: apiAddsh + "statistics/coupon", //新增
	validated: apiAddsh + "statistics/coupon/validated", //新增
	evaluation: apiAddsh + "statistics/coupon/evaluation", //新增

});