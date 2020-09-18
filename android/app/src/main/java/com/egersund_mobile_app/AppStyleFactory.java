package com.egersund_mobile_app;

import androidx.core.content.ContextCompat;

import com.facebook.react.bridge.ReactContext;
import com.egersund_mobile_app.R;
import com.portmone.ecomsdk.data.style.AppStyle;
import com.portmone.ecomsdk.data.style.ButtonStyle;
import com.portmone.ecomsdk.data.style.TextStyle;

public final class AppStyleFactory {
      private ButtonStyle createButtonStyles(ReactContext reactContext, Boolean isLight) {
            ButtonStyle buttonStyles = new ButtonStyle();
            buttonStyles.setCornerRadius(Constants.CORNER_RADIUS);
            buttonStyles.setBackgroundColor(ContextCompat.getColor(reactContext, R.color.colorYellowButton));
            buttonStyles.setTextColor(ContextCompat.getColor(reactContext, isLight ? R.color.textLightColor : R.color.textDarkColor));
            return buttonStyles;
      }

      private TextStyle createTextStyles(ReactContext reactContext, Boolean isLight) {
            TextStyle titleTextStyles = new TextStyle();
            titleTextStyles.setTextColor(ContextCompat.getColor(reactContext, isLight ? R.color.colorWhite : R.color.colorDark));
            return titleTextStyles;
      }

      public AppStyle createStyles(ReactContext reactContext, int type, String theme) {
            Boolean isLight = theme.equals("light");
            AppStyle styles = new AppStyle();
            ButtonStyle buttonStyles = createButtonStyles(reactContext, isLight);
            TextStyle titleTextStyles = createTextStyles(reactContext, isLight);

            styles.setToolbarColor(ContextCompat.getColor(reactContext, R.color.clearBlue));
            styles.setButtonStyle(buttonStyles);
            styles.setTitleTextStyle(titleTextStyles);

            styles.setType(type);

            return styles;
      }
}
