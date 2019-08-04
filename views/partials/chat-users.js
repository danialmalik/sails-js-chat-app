
<div class="ui basic segment">
    <h3>Members</h3>
    <hr/>
    <div id="users-content" class="ui middle aligned selection list"> </div>
</div>


<script id="usersTemplate" type="text/x-jsrender">
    <div class="item">
      <img class="ui avatar image" src="{{:avatar}}"/>
      <div class="content">
        <div class="header">{{:name}}</div>
      </div>
    </div>
</script>

<script type="text/javascript">
    function loadUsers() {
        // Load existing users
        io.socket.get('/user', function (users, response) {
            renderChatUsers(users);
        });

        // Listen for new & updated users
        io.socket.on('user', function (body) {
            io.socket.get('/user', function (users, response) {
                renderChatUsers(users);
            });
        });
    }

    function renderChatUsers(data) {
        const template = $.templates('#usersTemplate');
        let htmlOutput = template.render(data);
        $('#users-content').html(htmlOutput);
    }

</script>
