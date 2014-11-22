function squeeze() {
  var rowWidth = 0;
  var A = [];
  var width = window.innerWidth;
  var insertAfter;
  var insertThis;
  for (i = 0; i < $('.pet-box').length; i++ ) {
      A[i] = ($('.pet-box').eq(i).width())+38;

      if ((rowWidth + A[i]) > width) {
        insertAfter = (i-1);
        var extraSpace = width - rowWidth;
        // console.log('extraspace ', extraSpace);
        for (j = i; j < $('.pet-box').length; j++) {
          if (($('.pet-box').eq(j).width()+38) < extraSpace) {
            console.log(j + ' ' + $('.pet-box').eq(j).width());
            insertThis = j;
            $('.pet-box').eq(insertThis).insertAfter($('.pet-box').eq(insertAfter));
            $(insertThis).before(" ");
            squeeze();
            return false;
           }
         }
         rowWidth = A[i];
        //  console.log('rowWidth: ', rowWidth);
      }
      else {
        rowWidth += A[i];
        // console.log('rowWidth: ', rowWidth);
      }
  }
}

// next step
// $('.pet-box').eq(3).css("margin-right","+=5")
// take the boxes in the row and increment margin based on extra space available to allocate
