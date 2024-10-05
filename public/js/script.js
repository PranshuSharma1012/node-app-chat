$(document).ready(function () {

    

    $('.wcp-chat-body').animate({
        scrollTop: $('.wcp-chat-body')[0].scrollHeight
    }, 1000);

    $('#chatForm').submit(function (e){
        e.preventDefault()
        // alert('form is working')
        let message = $('.message-box').val()
        let reciverId = $('.partnerId').val()

        $.ajax({
            type: "post",
            url: "/chat/message",
            data: {message , reciverId},
            success: function (response) {
                if (response.is_success) {
                    $('.message-box').val('');
                }
            }
        });
    })



    // setInterval(refreshChat,1000);

    function refreshChat(){   
        // console.log('hi');

        let reciver_id = $('.partnerId').val();

        $.ajax({
            type: "GET",
            url: "/chatHistory/"+reciver_id,
            success: function (response) {

                
                if(response.is_success){
                    
                    // console.log(response.html); 

                    // $('.chatArea').html(response.html)
                    
                    
                    let oldChatCount = $('.wcp-chat-count').val();
                    
                    if (oldChatCount != response.chatCount) {

                        // console.log('new msg inside if');
                        
                        
                        $('.wcp-chat-count').val(response.chatCount);

                        $('.wcp-chat-body').html(response.html);
                       
                        
                        $('.wcp-chat-body').animate({
                            scrollTop: $('.wcp-chat-body')[0].scrollHeight
                        }, 1000);
                        
                    }

                }
            }
        });
    }

    refreshChat();

});

