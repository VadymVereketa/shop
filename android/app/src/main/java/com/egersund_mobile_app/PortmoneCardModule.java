package com.egersund_mobile_app;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.BaseActivityEventListener;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.IllegalViewOperationException;
import com.portmone.ecomsdk.PortmoneSDK;
import com.portmone.ecomsdk.data.Bill;
import com.portmone.ecomsdk.data.CardPaymentParams;
import com.portmone.ecomsdk.data.SaveCardParams;
import com.portmone.ecomsdk.data.TokenPaymentParams;
import com.portmone.ecomsdk.data.style.AppStyle;
import com.portmone.ecomsdk.ui.card.CardPaymentActivity;
import com.portmone.ecomsdk.ui.savecard.PreauthCardActivity;
import com.portmone.ecomsdk.ui.token.payment.TokenPaymentActivity;
import com.portmone.ecomsdk.util.Constant$BillCurrency;

import com.portmone.ecomsdk.util.Constant$Language;
import com.portmone.ecomsdk.util.Constant$Type;

import java.util.Arrays;
import java.util.List;

import static android.app.Activity.RESULT_OK;

public class PortmoneCardModule extends ReactContextBaseJavaModule {

    private static final AppStyleFactory APP_STYLE_FACTORY = new AppStyleFactory();
    private static final List<String> AVAILABLE_LANGUAGES = Arrays.asList(
        Constant$Language.EN, Constant$Language.RU, Constant$Language.UK
    );
    private static final String TOKEN_PROPERTY = "token";

    private ReactApplicationContext reactContext;
    private Promise promise;
    private String numberType;

    public PortmoneCardModule(@NonNull ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
        reactContext.addActivityEventListener(mActivityEventListener);
    }

    @Override
    public String getName() {
        return "PortmoneCardModule";
    }

    private String getLanguage(String lang) {
        return AVAILABLE_LANGUAGES.contains(lang) ? lang : Constant$Language.SYSTEM;
    }

    private int getTypeUI(String type) {
        return Constant$Type.DEFAULT;
    }

    private String getAttribute(String type) {
        if (type.equals(Constants.ACCOUNT_TYPE)) {
            return Constants.ATTR_1_ACCOUNT;
        }
        return Constants.ATTR_1_PHONE;
    }

    @ReactMethod
    public void invokePortmoneSdk(String lang, String type, String theme) {
        try {
            this.numberType = type;
            final AppStyle styles = APP_STYLE_FACTORY.createStyles(reactContext, getTypeUI(type), theme);
            PortmoneSDK.setLanguage(getLanguage(lang));
            PortmoneSDK.setFingerprintPaymentEnable(true);
            PortmoneSDK.setAppStyle(styles);
        } catch (IllegalViewOperationException e) {
            Log.d(Constants.PORTMONE_TAG, "invokePortmoneSdk: ERROR", e);
        }
    }

    @ReactMethod
    public void initCardPayment(String payeeId, String billNumber, Boolean preAuth, String phoneNumber, int billAmount, final Promise promise) {
        try {
            final CardPaymentParams params = new CardPaymentParams(
                payeeId,
                    billNumber,
                    preAuth,
                Constant$BillCurrency.UAH,
                "",
                    billAmount,
                false,
                false
            );
            CardPaymentActivity.performTransaction(
                getCurrentActivity(),
                Constants.REQUEST_CODE,
                params
            );
            this.promise = promise;
        } catch (IllegalViewOperationException e) {
            Log.d(Constants.PORTMONE_TAG, "initCardPayment: ERROR", e);
        }
    }

    @ReactMethod
    public void tokenCardPayment(String payeeId, String billNumber, Boolean preAuth, String cardMask, String token, int billAmount, String desc, final Promise promise) {
        try {
            final TokenPaymentParams params = new TokenPaymentParams(
                    payeeId,
                    billNumber,
                    preAuth,
                    Constant$BillCurrency.UAH,
                    cardMask,
                    token,
                    billAmount,
                    desc
            );
            TokenPaymentActivity.performTransaction(
                    getCurrentActivity(),
                    Constants.REQUEST_CODE,
                    params,
                    false
            );
            this.promise = promise;
        } catch (IllegalViewOperationException e) {
        }
    }

    @ReactMethod
    public void initCardSaving(String payeeId, String billNumber, String desc, final Promise promise) {
        try {
            final SaveCardParams saveCardParams = new SaveCardParams(
                payeeId,
                desc,
                    billNumber
            );
            PreauthCardActivity.performTransaction(
                getCurrentActivity(),
                Constants.REQUEST_CODE,
                saveCardParams
            );
            this.promise = promise;
        } catch (IllegalViewOperationException e) {
            Log.d(Constants.PORTMONE_TAG, "initCardSaving: ERROR", e);
        }
    }

    private final ActivityEventListener mActivityEventListener = new BaseActivityEventListener() {
        @Override
        public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent intent) {
            switch (requestCode) {
                case Constants.REQUEST_CODE:
                    if (resultCode == RESULT_OK) {
                        Bundle bundle = intent.getExtras();
                        Bill bill = (Bill)bundle.get(Constants.BILL_KEY);
                        String token = bill.getToken();
                        String cardMask = bill.getCardMask();
                        String billId = bill.getBillId();
                        double amount = bill.getBillAmount();

                        WritableMap map = Arguments.createMap();
                        map.putString("TOKEN", token);
                        map.putString("CARD_MASK", cardMask);
                        map.putString("SHOPBILLID", billId);
                        map.putDouble("BILL_AMOUNT", amount);
                        map.putString("result", "success");
                        promise.resolve(map);
                    } else {
                        WritableMap map = Arguments.createMap();
                        map.putString("result", "error");
                        promise.resolve(map);
                    }
                    WritableMap map = Arguments.createMap();
                    map.putString("result", "cancel");
                    promise.resolve(map);
                    break;
            }
        }
    };
}
