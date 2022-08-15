package com.awesomeproject;

import android.os.Build;

import androidx.annotation.NonNull;
import androidx.annotation.RequiresApi;

import com.dothantech.lpapi.LPAPI;
import com.dothantech.printer.IDzPrinter;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;

import java.util.List;

public class LPAPIModule extends ReactContextBaseJavaModule {

    private LPAPI api;

    @NonNull
    @Override
    public String getName() {
        return "LPAPIModule";
    }

    @ReactMethod
    public void initSDK() {
        api = LPAPI.Factory.createInstance();
    }

    @ReactMethod
    public void startJob(double width, double height, int orientation) {
        api.startJob(width, height, orientation);
    }

    @ReactMethod
    public void drawText(String var1, double var2, double var4, double var6, double var8, double var10) {
        api.drawText(var1, var2, var4, var6, var8, var10);
    }

    @ReactMethod
    public void setItemOrientation(int var1) {
        api.setItemOrientation(var1);
    }

    @ReactMethod
    public void draw1DBarcode(String var1, double var3, double var5, double var7, double var9, double var11) {
        api.draw1DBarcode(var1, LPAPI.BarcodeType.AUTO, var3, var5, var7, var9, var11);
    }

    @ReactMethod
    public boolean commitJob() {
        return api.commitJob();
    }

    @ReactMethod
    public void quit() {
        api.quit();
    }

    @ReactMethod
    public void openPrinter(String shownName, Callback callback) {
        callback.invoke(api.openPrinter(shownName));
    }

    @RequiresApi(api = Build.VERSION_CODES.N)
    @ReactMethod
    public void getAllPrinterAddressesPaired(Callback callback) {
        List<IDzPrinter.PrinterAddress> list = api.getAllPrinterAddresses(null);
        WritableMap map = Arguments.createMap();
        if (!list.isEmpty()) {
            list.forEach(item -> {
                map.putString(item.shownName, item.macAddress);
            });
        }
        callback.invoke(map);
    }

}
