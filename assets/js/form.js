        // $(document).ready(function(){
        //      // Check Radio-box
        //      $(".rating input:radio").attr("checked", false);
         
        //      $('.rating input').click(function () {
        //          $(".rating span").removeClass('checked');
        //          $(this).parent().addClass('checked');
        //      });
         
        //      $('input:radio').change(
        //        function(){
        //          var userRating = this.value;
        //          alert(userRating);
        //      }); 
        //  });



    function show(id,to){
        if(document.getElementById(id).checked){
            document.getElementById(to).style.display= "block";
        }else{
            document.getElementById(to).style.display= "none";
        }
    }

    $(document).ready(function(){
        //Markdown
        $('#inputText').markdown({
            hiddenButtons:'cmdPreview',
            iconlibrary: 'fa',
            language:'fr',
            footer:'<div id="preview" class="well" style="display:none;"></div>',
            onChange:function(e){
              var content = e.parseContent();
              if (content == '') {
                $('#preview').hide()
              } else {
                $('#preview').show().html(content)
              }
            }
          })
        
        //Handle submit
        document.getElementById("post-form").addEventListener("submit", handleForm);

        function handleForm(e) {
            e.preventDefault(); 

            $('#status').modal({
                show:true
            });
        }
    });