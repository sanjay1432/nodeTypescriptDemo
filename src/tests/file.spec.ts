import fs from "fs";
import path from "path";
import ENV from "../utils/env";
import Axios from "axios";

let fileId;
describe("File Upload test", () => {
  test("should upload the file", async () => {
    await expect(uploadFile("Alfred-1.png", "file")).resolves.toEqual(200);
  });
  afterAll(async () => {
    await fs.unlinkSync(path.join(__dirname, `../assets/uploads/` + fileId));
  });
});
async function uploadFile(filename, formdataname) {
  const data = new FormData();
  data.append(formdataname, new Blob([fs.readFileSync(path.join(__dirname, filename))]));
  const res = await Axios.post(`http://localhost:${ENV.PORT}/api/files/uploadFile`, data, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  fileId = res.data;
  return res.status;
}
