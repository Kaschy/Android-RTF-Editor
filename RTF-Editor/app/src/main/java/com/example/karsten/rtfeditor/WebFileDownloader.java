package com.example.karsten.rtfeditor;

import android.database.CursorJoiner;
import android.os.AsyncTask;
import android.util.Base64;
import android.util.Log;
import android.webkit.WebView;

import java.io.BufferedInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.UnsupportedEncodingException;
import java.net.URL;
import java.net.URLConnection;

/**
 * Created by Karsten on 16.11.2016.
 */

public class WebFileDownloader extends AsyncTask<String,String,String> {
    public String result = "no result";
    /**
     * Before starting background thread Show Progress Bar Dialog
     * */
    @Override
    protected void onPreExecute() {
        super.onPreExecute();
        //showDialog(progress_bar_type);
    }
    WebView browser;
    public void setBrowser(WebView wv){
        browser = wv;
    }

    /**
     * Downloading file in background thread
     * */
    @Override
    protected String doInBackground(String... f_url) {
        int count;
        try {
            URL url = new URL(f_url[0]);
            URLConnection connection = url.openConnection();
            connection.connect();

            // this will be useful so that you can show a tipical 0-100%
            // progress bar
            int lenghtOfFile = connection.getContentLength();

            // download the file
            InputStream input = new BufferedInputStream(url.openStream(),
                    8192);

            OutputStream output = new OutputStream()
            {
                private StringBuilder string = new StringBuilder();
                @Override
                public void write(int b) throws IOException {
                    this.string.append((char) b );
                }

                //Netbeans IDE automatically overrides this toString()
                public String toString(){
                    return this.string.toString();
                }
            };
            byte data[] = new byte[1024];

            long total = 0;

            while ((count = input.read(data)) != -1) {
                total += count;
                // publishing the progress....
                // After this onProgressUpdate will be called


                // writing data to file
                output.write(data, 0, count);
                int progr = (int) ((total * 100) / lenghtOfFile);
                publishProgress(""+progr);


            }
            //output.flush();
            result = output.toString();
            // flushing output


            // closing streams
            output.close();
            input.close();

        } catch (Exception e) {
            Log.e("Error: ", e.getMessage());
        }

        return result;
    }
    /**
     * Updating progress bar
     * */
    @Override
    protected void onProgressUpdate(String... progress) {
        // setting progress percentage
       // pDialog.setProgress(Integer.parseInt(progress[0]));
        //browser.loadUrl("javascript:test(`"+Integer.parseInt(progress[0])+"`);");


        //if(Integer.parseInt(progress[0]) == 100)
        //browser.loadUrl("javascript:test(`"+result+"`);");
    }

    /**
     * After completing background task Dismiss the progress dialog
     * **/
    @Override
    protected void onPostExecute(String result) {
        // dismiss the dialog after the file was downloaded
        //dismissDialog(progress_bar_type);
        //browser.loadUrl("javascript:test(`finish`);");

        Log.d("","sfxxx");
        browser.loadUrl("javascript:openFile(`"+base64(this.result)+"`);");

    }
    public static String base64(String string) {
        try{
            byte[] data = string.getBytes("UTF-8");
            String base64 = Base64.encodeToString(data, Base64.DEFAULT);
            return base64;
        }catch(UnsupportedEncodingException e){
            return "";
        }
    }

    public static String quote(String string) {
        if (string == null || string.length() == 0) {
            return "\"\"";
        }

        char         c = 0;
        int          i;
        int          len = string.length();
        StringBuilder sb = new StringBuilder(len + 4);
        String       t;

        sb.append('"');
        for (i = 0; i < len; i += 1) {
            c = string.charAt(i);
            switch (c) {
                case '\\':
                case '"':
                    sb.append('\\');
                    sb.append(c);
                    break;
                case '/':
                    //                if (b == '<') {
                    sb.append('\\');
                    //                }
                    sb.append(c);
                    break;
                case '\b':
                    sb.append("\\b");
                    break;
                case '\t':
                    sb.append("\\t");
                    break;
                case '\n':
                    sb.append("\\n");
                    break;
                case '\f':
                    sb.append("\\f");
                    break;
                case '\r':
                    sb.append("\\r");
                    break;
                default:
                    if (c < ' ') {
                        t = "000" + Integer.toHexString(c);
                        sb.append("\\u" + t.substring(t.length() - 4));
                    } else {
                        sb.append(c);
                    }
            }
        }
        sb.append('"');
        return sb.toString();
    }
}
