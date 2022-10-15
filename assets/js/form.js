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

  function handleForm(e) {
    e.preventDefault();
    const form_values = parseForm();
    let post_filled = buildPost(form_values);

    $('.modal-body').find('#statusText').html('@TODO');
    $('.modal-body').find('#statusPost').html(post_filled.replaceAll('\n', '<br>'));

    $('#status').modal({
      show: true
    });
  }
});