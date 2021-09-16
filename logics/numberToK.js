export default function numberToK(number) {
  let str = "";
  if (number < 1000) {
    str = number;
  } else if (1000 <= number < 1000000) {
    str += Math.round(number / 100) / 10;
    str += "k";
  }

  return str;
}
