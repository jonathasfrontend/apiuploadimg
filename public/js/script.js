function previewImage(input) {
  var preview = document.getElementById('image-preview');
  preview.innerHTML = '';

  if (input.files && input.files[0]) {
    var reader = new FileReader();

    reader.onload = function (e) {
      var img = document.createElement('img');
      var label = document.getElementsByTagName('label')[0]
      img.src = e.target.result;
      img.alt = 'Image Preview';
      img.style.width = '100%';
      img.style.height = '300px';
      preview.appendChild(img);

      label.style.lineHeight = '0px'
    };

    reader.readAsDataURL(input.files[0]);
  }
}