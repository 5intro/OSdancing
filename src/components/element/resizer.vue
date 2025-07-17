<template>
  <div style="width: 0.6%; margin-right: 2px" class="resizer" ></div>
</template>

<script>
export default {
  name: 'resizer',
  mounted() {
    this.resizerChanged();
  },
  methods:{
    //横向宽度改变条
    resizerChanged(){
      const resizers = document.querySelectorAll('.resizer');
      let currentResizer, startX, prevWidth, nextWidth;
      resizers.forEach(resizer => {
        resizer.addEventListener('mousedown', function(e) {
          currentResizer = e.target;
          startX = e.clientX;

          const prevSibling = currentResizer.previousElementSibling;
          const nextSibling = currentResizer.nextElementSibling;

          prevWidth = prevSibling.getBoundingClientRect().width;
          nextWidth = nextSibling.getBoundingClientRect().width;

          document.addEventListener('mousemove', mousemove);
          document.addEventListener('mouseup', mouseup);
        });
      });

      function mousemove(e) {
        if (!currentResizer) return;

        const dx = e.clientX - startX;

        const newPrevWidth = prevWidth + dx;
        const newNextWidth = nextWidth - dx;

        if (newPrevWidth > 300 && newNextWidth > 350) {
          currentResizer.previousElementSibling.style.width = `${newPrevWidth}px`;
          currentResizer.nextElementSibling.style.width = `${newNextWidth}px`;
        }
      }

      function mouseup() {
        document.removeEventListener('mousemove', mousemove);
        document.removeEventListener('mouseup', mouseup);
        currentResizer = null;
      }
    },
  }
}
</script>

<style>
.resizer {
  cursor: ew-resize;
}
.resizer:hover{
  background-color: cornflowerblue;
}
</style>