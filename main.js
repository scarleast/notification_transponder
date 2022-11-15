
var secret = ""
var lark_bot_url = ""


events.observeNotification();
events.on("notification", function(n){
    var package_name = n.getPackageName();
    if(package_name == "com.android.mms"){
        notify_to_lark("【短信通知】 " + n.getTitle(), n.getText());
    }else if(package_name == "com.tencent.mm"){
        notify_to_lark("【微信通知】 " + n.getTitle(), n.getText());
    }
    // 可以自行添加更多希望转发的app
    else{
        log("收到新通知:\n 标题: %s, 内容: %s, \n包名: %s", n.getTitle(), n.getText(), n.getPackageName());
    }
    n.delete();
});



function notify_to_lark(title, content){
    var timestamp = Math.floor(Date.now() / 1000);
    data = {
        "timestamp": timestamp,
        "sign": GenSign(secret, timestamp),
        "msg_type": "interactive",
        "card": {
            "config": {
            "wide_screen_mode": true
            },
            "elements": [
            {
                "tag": "div",
                "text": {
                "content": content,
                "tag": "lark_md"
                }
            },
            {
                "tag": "hr"
            }
            ],
            "header": {
            "template": "blue",
            "title": {
                "content": title,
                "tag": "plain_text"
            }
            }
        }
    };
    var res = http.postJson(lark_bot_url, data);
    if(res.statusCode != 200){
        log("请求失败: " + res.statusCode + " " + res.statusMessage);
    }else{
        log(res.body.json());
    }
}

importClass(javax.crypto.Mac);
importClass(javax.crypto.spec.SecretKeySpec);
importClass(java.nio.charset.StandardCharsets);

function GenSign(secret, timestamp){
    var stringToSign = new java.lang.String(timestamp + "\n" + secret)

    //使用HmacSHA256算法计算签名
    var mac = Mac.getInstance("HmacSHA256");        //HmacSHA256算法计算签名
    mac.init(new SecretKeySpec(stringToSign.getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
    signData = mac.doFinal();   
    var sign = android.util.Base64.encodeToString(signData, 0)
	return sign.replace(/[\r\n]/g,"")
}
