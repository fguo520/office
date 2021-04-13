
export default {
  handleEnter(hc) {
    document.onkeydown = (e) => {   //按下回车提交
      var event = e || window.event;
      if (event.keyCode && event.keyCode == 13) {
        hc();
      } else if (event.which == 13) {
        hc();
      }
    };
  }
}