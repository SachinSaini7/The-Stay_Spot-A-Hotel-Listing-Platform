// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  })
})()


// Tax-Switch 

let taxSwitch = document.querySelector("#switchCheckDefault");
  
  taxSwitch.addEventListener("click",()=>{
    let taxInfo=document.querySelectorAll(".tax-info");
    console.log(taxInfo);
    for(info of taxInfo){
    if(info.style.display != "inline"){
      info.style.display= "inline";
    }else{
      info.style.display= "none";
    }
  }
  })