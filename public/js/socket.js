let socket = io();

let ping = () => {
    const notificationAudio = new Audio('../sound/sound.mp3');    
    notificationAudio.play();
}

socket.on('total_online_users' , (data) => {

    // console.log(`front end : ${JSON.stringify(data)}`);
    console.log(data.count);
    
    $('.online-user-count').html(data.count);
});

socket.on('new_user' , (data) => {
    // ping();
    // $('.availability-status').attr('data-id', 1234);
    
    // $('.user-'+data.authId).attr('data-socket-id', data.socketId);
    $('.user-'+data.authId).html('Online');
    
    let authId = $('.authId').val();
    
    console.log('the data is :');   
    console.log(data);
    console.log(`id in form ${JSON.stringify(authId)}`);
    
    socket.emit('introduction' , {id:authId});

});

socket.on('updateDom' , (data) => {
    // console.log('upadte do event:');
    // console.log(data);
    
    $('.user-'+data.id).html('Online');
});

socket.on('updateOffline' , (data) => {

    let authId = $('.authId').val(); 
    
    console.log(`login id ${JSON.stringify(data)}`);
    console.log(`id in form ${JSON.stringify(authId)}`);


    $('.user-'+data.authId).html('Offline')
    
});



