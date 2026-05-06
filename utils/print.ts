import util from "util";

export default function print(data: any) {
  console.log(util.inspect(data, false, null, true /* enable colors */));
}
