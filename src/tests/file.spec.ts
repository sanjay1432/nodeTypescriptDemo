import fs from "fs";
import path from "path";
import ENV from "../utils/env";
// import FormData from "form-data";
import Axios from "axios";
(global as any).FormData = FormData;
describe("File Upload test", () => {
  test("should upload the file", async () => {
    const filename = await uploadFile("Alfred-1.png", "file");
    // // user = res;
    // expect(filename).toBeDefined();
    // await expect(uploadFile("Alfred-1.png", "file")).rejects.toThrowError(`${user._id}12 is not valid id!`);
    await expect(filename).resolves.toBeDefined();
  });
});
async function uploadFile(filename, formdataname) {
  const f = fs.readFileSync(path.join(__dirname, filename));
  const b = Buffer.from(f);
  const data = new FormData();
  data.append("file", JSON.stringify(b));
  try {
    const res = await Axios.post(`http://localhost:${ENV.PORT}/api/files/uploadFile`, data, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    return res;
  } catch (err) {
    return err;
  }
}
