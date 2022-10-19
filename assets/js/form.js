function show(id, to) {
  if (document.getElementById(id).checked) {
    document.getElementById(to).style.display = "block";
  } else {
    document.getElementById(to).style.display = "none";
  }
}

$(document).ready(function () {
  //Markdown
  $('#inputText').markdown({
    hiddenButtons: 'cmdPreview',
    iconlibrary: 'fa',
    language: 'fr',
    footer: '<div id="preview" class="well" style="display:none;"></div>',
    onChange: function (e) {
      var content = e.parseContent();
      if (content == '') {
        $('#preview').hide();
      } else {
        $('#preview').show().html(content);
      }
    }
  })

  //Handle submit
  document.getElementById("post-form").addEventListener("submit", handleForm);

  function evalStars() {
    const stars = document.querySelectorAll("#ratingInput input");
    let eval = "";

    for (let i = 0; i < stars.length; i++) {
      if (stars[i].checked) {
        eval = stars[i].value
        eval = parseFloat(eval)
        break;
      }
    }

    return eval
  }

  function parseForm() {
    let values = {};
    values["author"] = document.getElementById("inputAuthor").options[document.getElementById("inputAuthor").value].text;
    values["tags"] = document.getElementById("inputTags").value;
    values["category"] = document.getElementById("inputCategory").options[document.getElementById("inputCategory").value].text;
    values["title"] = document.getElementById("inputTitle").value;
    values["text"] = document.getElementById("inputText").value;
    values["abstract"] = document.getElementById("abstractCheckbox").checked ? document.getElementById("abstractInput").value : "";

    values["personne"] = document.getElementById("personneCheckbox").checked ? document.getElementById("personneInput").value : "";
    values["difficulty"] = document.getElementById("difficultyCheckbox").checked ? document.getElementById("difficultyInput").value : "";
    values["time"] = document.getElementById("timeCheckbox").checked ? document.getElementById("timeInput").value : "";
    values["rating"] = document.getElementById("ratingCheckbox").checked ? evalStars() : "";

    return values;
  }

  function clearForm() {
    document.getElementById("inputAuthor").selectedIndex = 0;
    document.getElementById("inputTags").value = "";
    document.getElementById("inputCategory").selectedIndex = 0;
    document.getElementById("inputTitle").value = "";
    document.getElementById("inputText").value = "";
    document.getElementById("preview").html = "";
    document.getElementById("abstractCheckbox").checked = false;
    document.getElementById("abstractInput").value = "";
    show('abstractCheckbox', 'abstractInput');
    document.getElementById("abstractCheckbox").checked = false;
    document.getElementById("personneInput").value = "";
    show('personneCheckbox', 'personneInput');
    document.getElementById("difficultyCheckbox").checked = false;
    document.getElementById("difficultyInput").value = "";
    show('difficultyCheckbox', 'difficultyInput');
    document.getElementById("timeCheckbox").checked = false;
    document.getElementById("timeInput").value = "";
    show('timeCheckbox', 'timeInput');
    document.getElementById("ratingCheckbox").checked = false;
    show('ratingCheckbox', 'ratingInput');
    let stars = document.querySelectorAll("#ratingInput input")
    for (let i = 0; i < stars.length; i++) {
      stars[i].checked = false;
    }
  }

  function buildPost(values) {
    let optional = "";
    optional += values["personne"] != "" ? "personne: " + values["personne"] + "\n" : "";
    optional += values["difficulty"] != "" ? "difficulty: " + values["difficulty"] + "\n" : "";
    optional += values["time"] != "" ? "time: " + values["time"] + "\n" : "";
    optional += values["rating"] != "" ? "rating: " + values["rating"] + "\n" : "";


    let tpl = `---
layout: post
title:  "${values["title"]}"
author: ${values["author"]}
categories: [${values["category"]}]
tags: [${values["tags"]}]
image: assets/images/recipes/37_aiguillettes_coco.jpg
beforetoc: ${values["abstract"]}
toc: true
${optional}
---
${values["text"]}
`
    return tpl;
  }

  async function handleForm(e) {
    e.preventDefault();
    const form_values = parseForm();
    let post_filled = buildPost(form_values);
    // block page interaction @TODO + token cache + regler le probleme de fail pour je ne sais quel raaison
    // Send file
    const date = new Date();
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const file_path = `_posts/${year}-${month}-${day}-${form_values["title"].normalize("NFD").replaceAll(" ", "-")}.md`;






    // const imagePath ='example.png';
    // const bytes = await readFilePromise(imagePath, 'binary');
    // const buffer = Buffer.from(bytes, 'binary');
    // const image_content = buffer.toString('base64');
    // console.log(image_content);

    var toBase64 = function (file, callBack) {
      file = file.files[0];
      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = function () {
        callBack(file, reader.result);
      };
      reader.onerror = function (error) {
        console.log('Error: ', error);
      };
    };

    let file = $('#validatedCustomFile').get(0).files[0];
    console.log(file);



    var reader = new FileReader();
    reader.readAsDataURL(file);
    let file_64 = reader.result;
    console.log(file_64);





    let resp = await window.post_github([
      {
        path: file_path, mode: '100644', content: post_filled,
        path: "toto.jpg", mode: '100644', content: file_64
      }
    ],
      `[POST] ${form_values["title"]}`,
      "RealVincentBerthet",
      "jekyll",
      "heads/posts"
    );

    $('.modal-body').find('#statusText').html(resp.status == 200 ? "<h5 style='color:green'>SUCCES<h5/>" : "<h5 style='color:red'>ERROR<h5/><br/>" + resp);
    $('.modal-body').find('#statusPost').html(post_filled.replaceAll('\n', '<br>'));

    //clear fields
    if (resp.status == 200) {
      clearForm();
    }
    $('#status').modal({
      show: true
    });




  }
});