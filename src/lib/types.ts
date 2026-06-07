/**
 * Additional Remark processor data,
 * used by this plugin
 *
 * @internal
 */
export interface IData {

  /**
   * Processed file paths.
   * It is used to prevent recursive looping
   *
   * @internal
   */
  processedFilePaths: string[];

}

declare module 'unified' {
  interface Data {
    remarkIncludeData?: IData;
  }
}
