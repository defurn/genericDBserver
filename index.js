

let request = page => {
  let xhr = new XMLHttpRequest();
  xhr.open('GET', `/${page}`, true);
  xhr.send();
  console.log(xhr)
}

function setLink(){
let mongoButton =
document.getElementById("mongo-link")

mongoButton.setAttribute("href", window.location.href + "dbcontents")
}

removeFields = (parent) => {
  parent = document.getElementById(parent);
  parent.lastElementChild.previousElementSibling.previousElementSibling.remove();
}

createField = () => {
  let inputs = document.createElement('div')

  let field = document.createElement('input');
  field.addEventListener('change', e => input.name = field.value)
  let fieldLabel = document.createElement('label');
  fieldLabel.innerHTML = "field: "
  inputs.appendChild(fieldLabel);
  inputs.appendChild(field);

  let inputLabel = document.createElement('label');
  inputLabel.innerHTML = " data: ";
  let input = document.createElement('input');
  input.name = '';
  inputs.appendChild(inputLabel);
  inputs.appendChild(input);

  return inputs;
}

function createFormFields(destination, numberOfFields) {
  let number = document.getElementById(numberOfFields).value || numberOfFields;
  console.log(number)
  destination = document.getElementById(destination);

  for (let i = 0; i < number; i++){
    destination.prepend(createField());
  }
}

const deleteFromDB = element => {
  let id = element.parentNode.id;
  let node = document.getElementById(id);
  let xhr = new XMLHttpRequest();
  xhr.open('DELETE', `/mongo/${id}`, true);
  xhr.send();

  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      if(xhr.response === 'deleted'){
        element.parentNode.parentNode.removeChild(node);
      }
    }
  }
}

//turn an element into a form version, create POST route in server
const editEntry = entry => {
  let id = entry.parentNode.id
}
