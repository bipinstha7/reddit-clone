// export function randomString(length: number): string {
export function randomString(length: number): string {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;

  /**
   * For large number of randomString,
   * their might be a case where old and newly created may match,
   * so we need to add timestamp or check the slug/string
   */
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
}

export function slugify(str: string, separator: string = "_"): string {
  str = str.trim();
  str = str.toLowerCase();

  // remove accents, swap ñ for n, etc
  const from = "åàáãäâèéëêìíïîòóöôùúüûñç·/_,:;";
  const to = "aaaaaaeeeeiiiioooouuuunc------";

  for (let i = 0, l = from.length; i < l; i++) {
    str = str.replace(new RegExp(from.charAt(i), "g"), to.charAt(i));
  }

  return str
    .replace(/[^a-z0-9 -]/g, "") // remove invalid chars
    .replace(/\s+/g, "-") // collapse whitespace and replace by -
    .replace(/-+/g, "-") // collapse dashes
    .replace(/^-+/, "") // trim - from start of text
    .replace(/-+$/, "") // trim - from end of text
    .replace(/-/g, separator);
}
