export function checkValidation(e) {
  // console.log("checkValidation")
  let { name, value } = e.target;
  switch (name) {
    case "name":
    case "f_name":
    case "description":
    case "question":
    case "subRole":
      if (value.length < 2)
        return name + " field must be at least 2 characters long";
      break;
    case "a":
    case "b":
    case "c":
    case "d":
    case "answer":
    case "no_of_questions":
    case "marks":
      if (value.length === 0) return name + " field is Required";
      break;
    case "email":
      if (value.length === 0) return name + " field is required";
      // Regex pattern to validate email format
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(value))
        return name + ", please enter a valid email address";
      break;
    case "phone":
      if (value.length !== 10) return name + " number is only 10 digit";
      break;
    case "password":
      const passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
      if (value.length === 0) return "Password is required";
      if (!passwordPattern.test(value))
        return "Password must be at least 8 characters long, and include at least one number, one lowercase letter, and one uppercase letter";
      break;
    default:
      return;
  }
}

export function validationImg(e) {
  const { files } = e.target;
  const file = files[0];
  if (!file) {
    return "Image is required";
  }
  // Additional validation logic here
  return "";
}
