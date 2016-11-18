package com.example.karsten.rtfeditor;

import android.app.Activity;
import android.app.ProgressDialog;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
//import java.net.URL;
import android.os.Bundle;
import android.os.Environment;
import android.support.design.widget.FloatingActionButton;
import android.support.design.widget.Snackbar;
import android.util.Log;
import android.view.View;
import android.support.design.widget.NavigationView;
import android.support.v4.view.GravityCompat;
import android.support.v4.widget.DrawerLayout;
import android.support.v7.app.ActionBarDrawerToggle;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.Toolbar;
import android.view.Menu;
import android.view.MenuItem;
import android.view.WindowManager;
import android.view.inputmethod.InputMethodManager;
import android.webkit.JavascriptInterface;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.os.AsyncTask;

import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLConnection;

/* An instance of this class will be registered as a JavaScript interface */
class MyJavaScriptInterface
{
    public static final String tag ="tag";
    public Activity activity;
    public WebView browser;
    @JavascriptInterface
    @SuppressWarnings("unused")
    public void processHTML(String html)
    {
        Log.d(tag,html);
    }
    @JavascriptInterface
    @SuppressWarnings("unused")
    public void hideKeyboard()
    {
        Log.d(tag,"hideKeyboard");
        View view = activity.getCurrentFocus();
        if (view != null) {
            InputMethodManager imm = (InputMethodManager)activity.getSystemService(Context.INPUT_METHOD_SERVICE);
            imm.hideSoftInputFromWindow(view.getWindowToken(), 0);
        }
    }
    @JavascriptInterface
    @SuppressWarnings("unused")
    public void keyboard(boolean i)
    {
        Log.d(tag,"inflateKeyboard2");
        InputMethodManager imm = (InputMethodManager) activity.getSystemService(Activity.INPUT_METHOD_SERVICE);
        if (!i){
            imm.toggleSoftInput(InputMethodManager.HIDE_IMPLICIT_ONLY, 0); // hide
        } else {
            //browser.requestFocus();
            //InputMethodManager imm = (InputMethodManager) activity.getSystemService(Context.INPUT_METHOD_SERVICE);
            imm.toggleSoftInput(InputMethodManager.SHOW_FORCED, InputMethodManager.HIDE_IMPLICIT_ONLY);
        }
    }
    @JavascriptInterface
    @SuppressWarnings("unused")
    public void toggleKeyboard2()
    {
        Log.d(tag,"inflateKeyboard2");
        InputMethodManager imm = (InputMethodManager) activity.getSystemService(Activity.INPUT_METHOD_SERVICE);
        if (imm.isActive()){
            imm.toggleSoftInput(InputMethodManager.HIDE_IMPLICIT_ONLY, 0); // hide
        } else {
            imm.toggleSoftInput(0, InputMethodManager.HIDE_IMPLICIT_ONLY); // show
        }
    }
}



public class MainActivity extends AppCompatActivity
        implements NavigationView.OnNavigationItemSelectedListener {


    //final Context myApp = this;

    private ProgressDialog pDialog;
    public static final int progress_bar_type = 0;

    // File url to download
    private static String file_url = "http://www.qwikisoft.com/demo/ashade/20001.kml";



   // final WebView browser = (WebView) findViewById(R.id.webview);
   public static void hideKeyboard(Activity activity) {
       InputMethodManager imm = (InputMethodManager) activity.getSystemService(Activity.INPUT_METHOD_SERVICE);
       //Find the currently focused view, so we can grab the correct window token from it.
       View view = activity.getCurrentFocus();
       //If no view currently has focus, create a new one, just so we can grab a window token from it
       if (view == null) {
           view = new View(activity);
       }
       imm.hideSoftInputFromWindow(view.getWindowToken(), 0);
   }
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        Toolbar toolbar = (Toolbar) findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);

        FloatingActionButton fab = (FloatingActionButton) findViewById(R.id.fab);
        fab.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Snackbar.make(view, "Replace with your own action", Snackbar.LENGTH_LONG)
                        .setAction("Action", null).show();
            }
        });

        DrawerLayout drawer = (DrawerLayout) findViewById(R.id.drawer_layout);
        ActionBarDrawerToggle toggle = new ActionBarDrawerToggle(
                this, drawer, toolbar, R.string.navigation_drawer_open, R.string.navigation_drawer_close);
        drawer.setDrawerListener(toggle);
        toggle.syncState();

        NavigationView navigationView = (NavigationView) findViewById(R.id.nav_view);
        navigationView.setNavigationItemSelectedListener(this);

        final WebView browser = (WebView) findViewById(R.id.webview);

        browser.getSettings().setJavaScriptEnabled(true);

// Register a new JavaScript interface called HTMLOUT
        MyJavaScriptInterface jsif = new MyJavaScriptInterface();
        jsif.activity = this;
        jsif.browser = browser;
        browser.addJavascriptInterface(jsif, "ANDROID");

// WebViewClient must be set BEFORE calling loadUrl!
        browser.setWebViewClient(new WebViewClient() {
            @Override
            public void onPageFinished(WebView view, String pageurl)
            {
                String url;
                /*

                final Intent intent = getIntent();
                final Uri uri = intent.getData();
                url = uri.toString();
                //*/




                url = "http://www.google.de";
                url = "http://thewalter.net/stef/software/rtfx/sample.rtf";
                browser.loadUrl("javascript:test(`"+url+"`);");

                WebFileDownloader wf = new WebFileDownloader();
                wf.setBrowser(browser);
                wf.execute(url);


               // browser.loadUrl("javascript:alert('"+intent.getDataString()+"');");
                //browser.loadUrl("javascript:alert('"+intent.getDataString()+";");
                //browser.loadUrl("javascript:window.HTMLOUT.processHTML('<head>'+document.getElementsByTagName('html')[0].innerHTML+'</head>');");
            }
        });

// load a web page
        browser.loadUrl("file:///android_asset/test.html");

        /*InputMethodManager inputMethodManager = (InputMethodManager) getSystemService(Activity.INPUT_METHOD_SERVICE);
        inputMethodManager.toggleSoftInputFromWindow ( browser.getWindowToken (),
                InputMethodManager.SHOW_FORCED,
                InputMethodManager.HIDE_IMPLICIT_ONLY );
        inputMethodManager.toggleSoftInputFromWindow ( browser.getWindowToken (),
                InputMethodManager.SHOW_FORCED,
                InputMethodManager.HIDE_IMPLICIT_ONLY );
                */




        //...
    }
    private String uri ="";
    //private Uri uri2;
    void handleSendText(Intent intent) {
        Log.d("df","handle send text");
        String sharedText = intent.getStringExtra(Intent.EXTRA_TEXT);
        if (sharedText != null) {
            // Update UI to reflect text being shared
        }
    }

    @Override
    public void onBackPressed() {
        DrawerLayout drawer = (DrawerLayout) findViewById(R.id.drawer_layout);
        if (drawer.isDrawerOpen(GravityCompat.START)) {
            drawer.closeDrawer(GravityCompat.START);
        } else {
            super.onBackPressed();
        }
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.main, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        // Handle action bar item clicks here. The action bar will
        // automatically handle clicks on the Home/Up button, so long
        // as you specify a parent activity in AndroidManifest.xml.
        int id = item.getItemId();

        //noinspection SimplifiableIfStatement
        if (id == R.id.action_settings) {
            return true;
        }

        return super.onOptionsItemSelected(item);
    }

    @SuppressWarnings("StatementWithEmptyBody")
    @Override
    public boolean onNavigationItemSelected(MenuItem item) {
        // Handle navigation view item clicks here.
        int id = item.getItemId();

        if (id == R.id.nav_camera) {
            // Handle the camera action
        } else if (id == R.id.nav_gallery) {

        } else if (id == R.id.nav_slideshow) {

        } else if (id == R.id.nav_manage) {

        } else if (id == R.id.nav_share) {

        } else if (id == R.id.nav_send) {

        }

        DrawerLayout drawer = (DrawerLayout) findViewById(R.id.drawer_layout);
        drawer.closeDrawer(GravityCompat.START);
        return true;
    }
}
