
#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(PortmoneCardModule, NSObject)

//initCardSaving(String payeeId, String billNumber, String desc
//initCardPayment(String payeeId, String billNumber, Boolean preAuth, String phoneNumber, Double billAmount
//tokenCardPayment(String payeeId, String billNumber, Boolean preAuth, String cardMask, String token, int billAmount, String desc,
RCT_EXTERN_METHOD(invokePortmoneSdk:(NSString *)lang)
RCT_EXTERN_METHOD(initCardPayment:(NSString *)payeeId
                  billNumber:(NSString *)billNumber
                  preAuth:(BOOL *)preAuth
                  phoneNumber:(NSString *)phoneNumber
                  billAmount:(double *)billAmount
                  resolve:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject
                  )
RCT_EXTERN_METHOD(initCardSaving:(NSString *)payeeId
                  billNumber:(NSString *)billNumber
                  desc:(NSString *)desc
                  resolve:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject
                  )
RCT_EXTERN_METHOD(tokenCardPayment:(NSString *)payeeId
                  billNumber:(NSString *)billNumber
                  preAuth:(BOOL *)preAuth
                  cardMask:(NSString *)cardMask
                  token:(NSString *)token
                  billAmount:(double *)billAmount
                  desc:(NSString *)desc
                  resolve:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject
                  )


+ (BOOL)requiresMainQueueSetup
{
    return YES;
}

- (dispatch_queue_t)methodQueue
{
    return dispatch_get_main_queue();
}
@end
