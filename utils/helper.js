function return_encrypt_email(email) {
  if (typeof email !== 'string') {
    email = email[0]
  }
  let split_email = email.split('@')
  split_email[0] = split_email[0][0] + '*'.repeat(split_email[0].length - 1)
  return split_email[0] + '@' + split_email[1]
}

function check_password(password) {
  return /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-,]).{8,200}/.test(password)
}

function validateEmail(email) 
    {
        var re = /\S+@\S+\.\S+/;
        return re.test(email);
    }
    
module.exports = {
  validateEmail,
  check_password,
  return_encrypt_email,
}
