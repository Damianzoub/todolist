document.addEventListener('DOMContentLoaded',function (){
    const checkboxes = document.querySelectorAll('input[type="checkbox"][name="use_type"]');
    const submitBtn = document.querySelector('input[type="submit"]');

    checkboxes.forEach(check =>{
        check.addEventListener('change', () =>{
            const anyChecked = Array.from(checkboxes).some( c => c.checked);
            submitBtn.disabled = !anyChecked;

        });
    });
    submitBtn.disabled = true;
});

