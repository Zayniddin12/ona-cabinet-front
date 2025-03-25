import { FileLoader } from "@ckeditor/ckeditor5-upload";

export default class UploadAdapter {
  abortController: AbortController;
  loader: FileLoader;
  store: any;

  constructor(loader: FileLoader) {
    // this.store = useStore();
    this.abortController = new AbortController();
    // The file loader instance to use during the upload.
    this.loader = loader;
  }

  // Starts the upload process.
  upload() {
    // Update the loader's progress.

    // server.onUploadProgress((data) => {
    //   this.loader.uploadTotal = data.total;
    //   this.loader.uploaded = data.uploaded;
    // });

    // Return a promise that will be resolved when the file is uploaded.
    return this.loader.file.then(async (file: File) => {
      const data = new FormData();
      data.append("img", file);
      const response = await this.store.postFile("image/create/", data, {
        signal: this.abortController.signal,
        onUploadProgress: (e) => {
          if (e.lengthComputable) {
            this.loader.uploadTotal = e.total;
            this.loader.uploaded = e.loaded;
          }
        },
      });
      return { default: response.img };
    });
  }

  abort() {
    this.abortController.abort();
  }
}
