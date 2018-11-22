# 123123
# 123123
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Document</title>
  <script src="js/layui.js"></script>
  <script src="https://cdn.staticfile.org/angular.js/1.4.6/angular.min.js"></script>
  <script type="text/html" id="barDemo">
    <a class="layui-btn layui-btn-xs" lay-event="edit">编辑</a>
    <a class="layui-btn layui-btn-danger layui-btn-xs" lay-event="del">删除</a>
  </script>
  <script src="https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js"></script>
  <link rel="stylesheet" href="css/layui.css?t=1542630986934" media="all">
</head>

<body>

  <div class="layui-form" action="" id="bb">
    <div class="layui-form-item">
      <label class="layui-form-label">输入框</label>
      <div class="layui-input-block">
        <input type="text" name="title" required lay-verify="required" placeholder="请输入标题" autocomplete="off" class="layui-input">
      </div>
    </div>
    <div class="layui-form-item">
      <label class="layui-form-label">密码框</label>
      <div class="layui-input-block">
        <input type="password" name="password" required lay-verify="required" placeholder="请输入密码" autocomplete="off"
          class="layui-input">
      </div>
    </div>
    <div class="layui-form-item">
      <label class="layui-form-label">选择框</label>
      <div class="layui-input-block">
        <select name="city" lay-verify="required">
          <option value=""></option>
          <option value="0">北京</option>
          <option value="1">上海</option>
          <option value="2">广州</option>
          <option value="3">深圳</option>
          <option value="4">杭州</option>
        </select>
      </div>
    </div>

    <div class="layui-form-item" id="cc">
      <div class="layui-input-block">
        <button class="layui-btn" lay-submit lay-filter="formDemo">立即提交</button>
        <button type="reset" class="layui-btn layui-btn-primary">取消</button>
      </div>
    </div>
  </div>



  <table id="demo" lay-filter="test"></table>

  <script>
    layui.use('table', function () {
      var table = layui.table;
      table.render({
        elem: '#demo',
        height: 500,
        data: [{
          "id": 10016,
          "username": "user-16",
          "sex": "女",
          "city": "城市-16",
          "sign": "签名-16",
          "experience": 862,
          "logins": 168,
          "wealth": 37069775,
          "classify": "酱油",
          "score": 86
        }, {
          "id": 10017,
          "username": "user-17",
          "sex": "女",
          "city": "城市-17",
          "sign": "签名-17",
          "experience": 1060,
          "logins": 187,
          "wealth": 66099525,
          "classify": "作家",
          "score": 69
        }, {
          "id": 10018,
          "username": "user-18",
          "sex": "女",
          "city": "城市-18",
          "sign": "签名-18",
          "experience": 866,
          "logins": 88,
          "wealth": 81722326,
          "classify": "词人",
          "score": 74
        }, {
          "id": 10019,
          "username": "user-19",
          "sex": "女",
          "city": "城市-19",
          "sign": "签名-19",
          "experience": 682,
          "logins": 106,
          "wealth": 68647362,
          "classify": "词人",
          "score": 51
        }, {
          "id": 10020,
          "username": "user-20",
          "sex": "男",
          "city": "城市-20",
          "sign": "签名-20",
          "experience": 770,
          "logins": 24,
          "wealth": 92420248,
          "classify": "诗人",
          "score": 87
        }, {
          "id": 10021,
          "username": "user-21",
          "sex": "男",
          "city": "城市-21",
          "sign": "签名-21",
          "experience": 184,
          "logins": 131,
          "wealth": 71566045,
          "classify": "词人",
          "score": 99
        }, {
          "id": 10022,
          "username": "user-22",
          "sex": "男",
          "city": "城市-22",
          "sign": "签名-22",
          "experience": 739,
          "logins": 152,
          "wealth": 60907929,
          "classify": "作家",
          "score": 18
        }, {
          "id": 10023,
          "username": "user-23",
          "sex": "女",
          "city": "城市-23",
          "sign": "签名-23",
          "experience": 127,
          "logins": 82,
          "wealth": 14765943,
          "classify": "作家",
          "score": 30
        }, {
          "id": 10024,
          "username": "user-24",
          "sex": "女",
          "city": "城市-24",
          "sign": "签名-24",
          "experience": 212,
          "logins": 133,
          "wealth": 59011052,
          "classify": "词人",
          "score": 76
        }, {
          "id": 10025,
          "username": "user-25",
          "sex": "女",
          "city": "城市-25",
          "sign": "签名-25",
          "experience": 938,
          "logins": 182,
          "wealth": 91183097,
          "classify": "作家",
          "score": 69
        }, {
          "id": 10026,
          "username": "user-26",
          "sex": "男",
          "city": "城市-26",
          "sign": "签名-26",
          "experience": 978,
          "logins": 7,
          "wealth": 48008413,
          "classify": "作家",
          "score": 65
        }, {
          "id": 10027,
          "username": "user-27",
          "sex": "女",
          "city": "城市-27",
          "sign": "签名-27",
          "experience": 371,
          "logins": 44,
          "wealth": 64419691,
          "classify": "诗人",
          "score": 60
        }, {
          "id": 10028,
          "username": "user-28",
          "sex": "女",
          "city": "城市-28",
          "sign": "签名-28",
          "experience": 977,
          "logins": 21,
          "wealth": 75935022,
          "classify": "作家",
          "score": 37
        }, {
          "id": 10029,
          "username": "user-29",
          "sex": "男",
          "city": "城市-29",
          "sign": "签名-29",
          "experience": 647,
          "logins": 107,
          "wealth": 97450636,
          "classify": "酱油",
          "score": 27
        }], //数据接口
        limit: 1000,
        cols: [
          [ //表头
            {
              field: 'id',
              title: 'ID',
              width: 80,
              sort: true,
              fixed: 'left'
            }, {
              field: 'username',
              title: '用户名',
              width: 80
            }, {
              field: 'sex',
              title: '性别',
              width: 80,
              sort: true
            }, {
              field: 'city',
              title: '城市',
              width: 80
            }, {
              field: 'sign',
              title: '签名',
              width: 177
            }, {
              field: 'experience',
              title: '积分',
              width: 80,
              sort: true
            }, {
              field: 'score',
              title: '评分',
              width: 80,
              sort: true
            }, {
              field: 'classify',
              title: '职业',
              width: 80
            }, {
              fixed: 'right',
              title: '操作',
              toolbar: '#barDemo',
              width: 150
            }
          ]
        ]
      });
      //监听行工具事件
      table.on('tool(test)', function (obj) {
        var data = obj.data;
        //console.log(obj)
        if (obj.event === 'del') {
          layer.confirm('真的删除行么', function (index) {
            obj.del();
            layer.close(index);
          });
        } else if (obj.event === 'edit') {
          layer.open({
            title: '在线调试',
            type : 1,
            content: $('#bb'),
            success: function (layero, index) {
              console.log(layero)
            }
          });
        }
      });

    });
  </script>
  <!-- <script type="text/html" id="barDemo">
    <a class="layui-btn layui-btn-primary layui-btn-xs" lay-event="detail">查看</a>
        <a class="layui-btn layui-btn-xs" lay-event="edit">编辑</a>
        <a class="layui-btn layui-btn-danger layui-btn-xs" lay-event="del">删除</a>
      </script> -->
</body>


</html>
