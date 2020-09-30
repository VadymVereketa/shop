
import UIKit
import Foundation

@objc(PortmoneCardModule)
class PortmoneCardModule: NSObject, RCTBridgeModule {
    private var portmoneCardViewController: PortmoneCardViewController?
    private var rootViewController: UIViewController = UIApplication.shared.keyWindow!.rootViewController!
    
    static func moduleName() -> String! {
        return "PortmoneCardModule"
    }
    
    @objc(invokePortmoneSdk:)
    public func invokePortmoneSdk(lang: String) -> Void {
      print(lang)
        self.portmoneCardViewController = PortmoneCardViewController()
        print(1)
        
        self.portmoneCardViewController?.invokePortmoneSdk(lang: lang)
        self.rootViewController.present(self.portmoneCardViewController!, animated: true)
    }
    
  //initCardPayment(String payeeId, String billNumber, Boolean preAuth, String phoneNumber, Double billAmount
  @objc(initCardPayment:billNumber:preAuth:phoneNumber:billAmount:resolve:rejecter:)
    public func initCardPayment(payeeId: String,
                                billNumber: String,
                                preAuth: Bool,
                                phoneNumber: String,
                                billAmount: Double,
                                _ resolve: @escaping RCTPromiseResolveBlock,
                                rejecter reject: @escaping RCTPromiseRejectBlock
    ) {
        self.portmoneCardViewController?.initCardPayment(
            payeeId: payeeId,
            billNumber: billNumber,
            preAuth: preAuth,
            phoneNumber: phoneNumber,
            billAmount: billAmount
        ) {(result, error) in
             if (result != nil) {
                         resolve([
                           "TOKEN": result?.TOKEN,
                           "result": "success",
                           "CARD_MASK": result?.CARD_MASK,
                           "SHOPBILLID": result?.SHOPBILLID,
                           "BILL_AMOUNT": result?.BILL_AMOUNT
                           ])
                           return
                       }
                       
                       if (error != nil) {
                           resolve([
                                          "result": "error"
                                          ])
                                          return
                       }
            
            resolve("")
            return
            
        }
    }

  //tokenCardPayment(String payeeId, String billNumber, Boolean preAuth, String cardMask, String token, int billAmount, String desc,
  @objc(tokenCardPayment:billNumber:preAuth:cardMask:token:billAmount:desc:resolve:rejecter:)
     public func tokenCardPayment(payeeId: String,
                                 billNumber: String,
                                 preAuth: Bool,
                                 cardMask: String,
                                 token: String,
                                 billAmount: Double,
                                 desc: String,
                                 _ resolve: @escaping RCTPromiseResolveBlock,
                                 rejecter reject: @escaping RCTPromiseRejectBlock
     ) {
         self.portmoneCardViewController?.tokenCardPayment(
             payeeId: payeeId,
             billNumber: billNumber,
             preAuth: preAuth,
             cardMask: cardMask,
             token: token,
             billAmount: billAmount,
             desc: desc
         ) {(result, error) in
              if (result != nil) {
                          resolve([
                            "TOKEN": result?.TOKEN,
                            "result": "success",
                            "CARD_MASK": result?.CARD_MASK,
                            "SHOPBILLID": result?.SHOPBILLID,
                            "BILL_AMOUNT": result?.BILL_AMOUNT
                            ])
                            return
                        }
                        
                        if (error != nil) {
                            resolve([
                                           "result": "error"
                                           ])
                                           return
                        }
             
             resolve("")
             return
             
         }
     }
    //initCardSaving(String payeeId, String billNumber, String desc
  @objc(initCardSaving:billNumber:desc:resolve:rejecter:)
  public func initCardSaving(payeeId: String, billNumber: String, desc: String, _ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    self.portmoneCardViewController?.initCardSaving(payeeId: payeeId, billNumber: billNumber, desc: desc) {(result, error) in
            if (result != nil) {
              resolve([
                "TOKEN": result?.TOKEN,
                "result": "success",
                "CARD_MASK": result?.CARD_MASK,
                "SHOPBILLID": result?.SHOPBILLID,
                "BILL_AMOUNT": result?.BILL_AMOUNT
                ])
                return
            }
            
            if (error != nil) {
                resolve([
                               "result": "error"
                               ])
                               return
            }
            
            resolve("")
            return
        }
    }
}
