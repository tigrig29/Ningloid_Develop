[current layer="message1"]

[l]
;[messageconfig left=5% top=75% width=90% height=20% opacity=0.8 margin=10px]
[messageconfig style="{'left': '5%', 'top': '75%', 'width': '90%', 'height': '20%'}" opacity=0.8 margin=10px]
[bg storage="room.jpg" time=1000]


[button layer=message0 name=save_button x=100px y=100px text=Save font-size=100px role=save]
[button layer=message0 name=load_button x=500px y=100px text=Load font-size=100px role=load]
[showbutton layer=message0]


[showmessage method="lightSpeedIn" time=1000]
aaaaa[l][cm]
iiii[l][er]
親譲りの無鉄砲で小供の時から損ばかりしている。小学校に居る時分学校の二階から飛び降りて一週間ほど、腰を抜かした事がある。なぜそんな無闇をしたと聞く人があるかも知れぬ。別段深い理由でもない。新。築の二階から首を出していたら、同級生の一人が冗談に、いくら威張っても、そこから飛び降りる事は」出来まい。弱虫やーい。と囃したからである。[l]
[playbgm storage="test.ogg" loop=true]
[stopbgm fade=5000]

[l]

[playmovie layer=fore0 storage="3.webm" fade=1000 clickskip=true]
[stopmovie layer=fore0 remove=3000]

[hidemessage method="lightSpeedOut"]


[l]

[charashow left=800px top=550px scale=2.5 name=test face=sad pose=second]
;[chara_show name=test pose=second face=angry x=500 fromX=0]

*test|テスト

[l]
[macro name=testMacro]
	[iscript]
		tf.test = 100;
		console.log(tf);

		const test2 = 143;
		console.log(tf.test * test2 + 114514);
		// mp.storage = "rouka.jpg";
	[endscript]
	[bg storage=%storage|'test.jpg']
[endmacro]

@testMacro storage=rouka.jpg

;[bg storage="rouka.jpg"]

[showmessage]

[cm]

テスト[l][cm]

[hidemessage]

[bg storage="room.jpg"]

[bg storage="rouka.jpg"]

[showmessage]

テスト[l][cm]

[hidemessage]
[s]

[jump storage=second.ks]