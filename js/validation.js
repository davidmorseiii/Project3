
const stateAbbreviations = [
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
    'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
    'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
    'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
    'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
];

const regexPatterns = {
    zip: /^\d{5}(-\d{4})?$/,
    phone: /^(\+1\s?)?(\d{3}|\(\d{3}\))[-.\s]?\d{3}[-.\s]?\d{4}$/,
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
};

function initValidation(formSelector) {
    const form = document.querySelector(formSelector);
    if (!form) {
        console.error(`Form with selector "${formSelector}" not found.`);
        return;
    }

    form.addEventListener('submit', function(event) {
        event.preventDefault();
        event.stopPropagation();

        if (validateForm(form)) {
            form.parentElement.querySelector('#success').style.display = 'block';
            form.style.display = 'none';
        } else {
            console.log('Form validation failed.');
        }
    });

    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(input);
        });
    });
}

function validateForm(form) {
    let isValid = true;

    isValid &= checkRequired('first-name', 'First name is required.');
    isValid &= checkRequired('last-name', 'Last name is required.');
    isValid &= checkRequired('address', 'Address is required.');
    isValid &= checkRequired('city', 'City is required.');
    isValid &= checkRequired('state', 'State is required.');
    isValid &= checkRequired('zip', 'Zip code is required.');
    isValid &= checkRequired('email', 'Email is required.');
    isValid &= checkRequired('phone', 'Phone number is required.');
    isValid &= checkRequiredCheckboxGroup('find-page', 'Please select at least one option.');

    isValid &= checkFormat('zip', 'Invalid zip code format.', regexPatterns.zip);
    isValid &= checkFormat('phone', 'Invalid phone number format.', regexPatterns.phone);
    isValid &= checkFormat('email', 'Invalid email format.', regexPatterns.email);

    isValid &= validateState('state', 'Invalid state abbreviation.');

    return !!isValid;
}

function validateField(input) {
    const fieldId = input.id;
    let valid = true;
    let message = '';

    switch(fieldId) {
        case 'first-name':
        case 'last-name':
        case 'address':
        case 'city':
            valid = checkRequired(fieldId, 'This field is required.');
            break;
        case 'state':
            valid = checkRequired(fieldId, 'State is required.');
            if (valid) {
                valid = validateState(fieldId, 'Invalid state abbreviation.');
            }
            break;
        case 'zip':
            valid = checkRequired(fieldId, 'Zip code is required.');
            if (valid) {
                valid = checkFormat(fieldId, 'Invalid zip code format.', regexPatterns.zip);
            }
            break;
        case 'phone':
            valid = checkRequired(fieldId, 'Phone number is required.');
            if (valid) {
                valid = checkFormat(fieldId, 'Invalid phone number format.', regexPatterns.phone);
            }
            break;
        case 'email':
            valid = checkRequired(fieldId, 'Email is required.');
            if (valid) {
                valid = checkFormat(fieldId, 'Invalid email format.', regexPatterns.email);
            }
            break;
        case 'newspaper':
            break;
        default:
            break;
    }

    return valid;
}

function checkRequired(fieldId, requiredMessage) {
    const field = document.getElementById(fieldId);
    if (!field) {
        console.error(`Field with ID "${fieldId}" not found.`);
        return false;
    }

    let isValid = false;

    if (field.type === 'checkbox') {
        const checkboxes = document.querySelectorAll(`input[name="${field.name}"]`);
        isValid = Array.from(checkboxes).some(checkbox => checkbox.checked);
    } else {
        isValid = field.value.trim() !== '';
    }

    setElementValidity(fieldId, isValid, requiredMessage);
    return isValid;
}

function checkRequiredCheckboxGroup(groupName, requiredMessage) {
    const checkboxes = document.querySelectorAll(`input[name="${groupName}"]`);
    const isValid = Array.from(checkboxes).some(checkbox => checkbox.checked);
    if (checkboxes.length > 0) {
        setElementValidity(checkboxes[checkboxes.length - 1].id, isValid, requiredMessage);
    }
    return isValid;
}

function checkFormat(fieldId, badFormatMessage, regex) {
    const field = document.getElementById(fieldId);
    if (!field) {
        console.error(`Field with ID "${fieldId}" not found.`);
        return false;
    }

    const isValid = regex.test(field.value.trim());
    setElementValidity(fieldId, isValid, isValid ? '' : badFormatMessage);
    return isValid;
}

function validateState(fieldId, invalidMessage) {
    const field = document.getElementById(fieldId);
    if (!field) {
        console.error(`Field with ID "${fieldId}" not found.`);
        return false;
    }

    const state = field.value.trim().toUpperCase();
    const isValid = stateAbbreviations.includes(state);
    setElementValidity(fieldId, isValid, isValid ? '' : invalidMessage);
    return isValid;
}

function setElementValidity(id, valid, message) {
    const field = document.getElementById(id);
    const errorDiv = field.parentElement.querySelector('.errorMsg');

    if (valid) {
        field.classList.remove('invalid');
        field.classList.add('valid');
        field.setCustomValidity('');
        if (errorDiv) {
            errorDiv.textContent = '';
            errorDiv.style.display = 'none';
        }
    } else {
        field.classList.remove('valid');
        field.classList.add('invalid');
        field.setCustomValidity(message);
        if (errorDiv) {
            errorDiv.textContent = message;
            errorDiv.style.display = 'block';
        }
    }

    field.classList.add('was-validated');
}
