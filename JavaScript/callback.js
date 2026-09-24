function sum(a,b){
    return a+b;
}
function sumWithMsg(callback,msg){
    const result = callback(20,30);
    const fresult = "Hi" + msg + " Your score is : " + result;
    console.log(fresult);
}

sumWithMsg(sum," Deepak");