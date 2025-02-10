console.log('FeelFriends');
const siteTopButton=document.querySelector('.site-scroll-top')

function scrollTop(){
    window.scrollTo({top:0,behavior:'smooth'});
}

if (!!siteTopButton) {
    siteTopButton.addEventListener('click',scrollTop)
}