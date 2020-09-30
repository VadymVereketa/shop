import Foundation
import UIKit
import PortmoneSDKEcom

struct FinishPaymentsData: Codable {
    let TOKEN: String
    let CARD_MASK: String
    let SHOPBILLID: String
    let BILL_AMOUNT: Double
}

struct ErrorPaymentsData: Codable {
    let token: String
}

struct JSON {
    static let encoder = JSONEncoder()
}

class PortmoneCardViewController: UIViewController {
    private let closeModalCode = 0
    private let mobilePaymentType: PaymentType = .mobilePayment
    private let defaultPaymentType: PaymentType = .payment
    private let paymentFlowType: PaymentFlowType = .byCardAndApplePay
    private let billAmountWcvv: Double = 8000
    
    private var lang: String?
    private var paymentPresenter: PaymentPresenter?
    private var cardStyle: PortmoneCardStyle?
    private var resolver: PortmoneCardResolver?
    
    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    
    override init(nibName nibNameOrNil: String?, bundle nibBundleOrNil: Bundle?) {
        super.init(nibName: nibNameOrNil, bundle: nibBundleOrNil)
        
        self.cardStyle = PortmoneCardStyle.init()
    }
    
    public func invokePortmoneSdk(lang: String?) {
        self.paymentPresenter = PaymentPresenter(
            delegate: self,
            styleSource: cardStyle,
            language: Language(rawValue: lang!) ?? Language.ukrainian)
    }

    //initCardPayment(String payeeId, String billNumber, Boolean preAuth, String phoneNumber, int billAmount
    public func initCardPayment(payeeId: String,
                                billNumber: String,
                                preAuth: Bool,
                                phoneNumber: String,
                                billAmount: Double,
                                competition: @escaping (_ result: FinishPaymentsData?, _ error: Error?) -> Void
    ) {
        self.resolver = PortmoneCardResolver(resolver: competition)
        let paymentParams = self.getCardPaymentParams(
            payeeId: payeeId,
            phoneNumber: phoneNumber,
            billAmount: billAmount,
            preAuth: preAuth,
            billNumber: billNumber
        )
        
        self.paymentPresenter?.presentPaymentByCard(
            on: self,
            params: paymentParams,
            showReceiptScreen: false
        )
    }
  

  //tokenCardPayment(String payeeId, String billNumber, Boolean preAuth, String cardMask, String token, int billAmount, String desc,
  public func tokenCardPayment(payeeId: String,
                              billNumber: String,
                              preAuth: Bool,
                              cardMask: String,
                              token: String,
                              billAmount: Double,
                              desc: String,
                              competition: @escaping (_ result: FinishPaymentsData?, _ error: Error?) -> Void
  ) {
      self.resolver = PortmoneCardResolver(resolver: competition)
      let paymentParams = self.getCardPaymentParams(
          payeeId: payeeId,
          phoneNumber: desc,
          billAmount: billAmount,
          preAuth: preAuth,
          billNumber: billNumber
      )
      
    let tokenParams = self.getTokenPaymentParams(cardMask: cardMask, token: token)
    
    self.paymentPresenter?.presentPaymentByToken(on: self, payParams: paymentParams, tokenParams: tokenParams, showReceiptScreen: false)
  }
  
     //initCardSaving(String payeeId, String billNumber, String desc
  public func initCardSaving(payeeId: String,billNumber: String, desc: String, competition: @escaping (_ result: FinishPaymentsData?, _ error: Error?) -> Void) {
        self.resolver = PortmoneCardResolver(resolver: competition)
        let savingParams = self.getCardSavingParams(payeeId: payeeId, billNumber: billNumber, desc: desc)
        
        self.paymentPresenter?.presentPreauthCard(on: self, params: savingParams)
    }
    
    private func getTypeUI(type: String) -> PaymentType {
        return defaultPaymentType
    }

    private func getAttribute(type: String) -> String {
        if (type == "account") {
            return "A"
        }
        return "P"
    }

  //initCardPayment(String payeeId, String billNumber, Boolean preAuth, String phoneNumber, int billAmount
    private func getCardPaymentParams(
        payeeId: String,
        phoneNumber: String,
        billAmount: Double,
        preAuth: Bool,
        billNumber: String
    ) -> PaymentParams {
        return PaymentParams(
            description: phoneNumber,
            preauthFlag: preAuth,
            billAmount: billAmount,
            payeeId: payeeId,
            type: self.getTypeUI(type: ""),
            paymentFlowType: paymentFlowType
        )
    }
  
  private func getTokenPaymentParams(
      cardMask: String,
      token: String
  ) -> TokenPaymentParams {
      return TokenPaymentParams(
         cardNumberMasked: cardMask, tokenData: token
      )
  }
  
    private func getCardSavingParams(
        payeeId: String,
        billNumber: String,
        desc: String
    ) -> PreauthParams {
        return PreauthParams(
            payeeId: payeeId,
            description: desc,
            billNumber: billNumber
        )
    }
    
    private func dismissView() -> Void {
        self.dismiss(
            animated: true,
            completion: self.removeFromParent
        )
    }
}

extension PortmoneCardViewController: PortmonePaymentPresenterDelegate {
    func didFinishPayment(bill: Bill?, error: Error?) {
        if error != nil {
            self.resolver?.onPaymentFinish(nil, error)
            self.resolver = nil
        }
        
        if bill != nil {
            let token = bill?.token ?? ""
            let cardMask = bill?.cardMask ?? ""
            let billAmount = bill?.billAmount ?? 1
            let billId = bill?.billId ?? ""
            
            let data = FinishPaymentsData(TOKEN: token, CARD_MASK: cardMask, SHOPBILLID: billId, BILL_AMOUNT: billAmount)
            self.resolver?.onPaymentFinish(data, nil)
            self.resolver = nil
        }
    }
    
    func dismissedSDK() {
        let error = NSError(domain: "Result code: \(closeModalCode)", code: closeModalCode, userInfo: nil)
        self.resolver?.onPaymentFinish(nil, error)
        self.resolver = nil
        self.dismissView()
    }
}

extension Encodable {
    subscript(key: String) -> Any? {
        return dictionary[key]
    }
    var dictionary: [String: Any] {
        return (try? JSONSerialization.jsonObject(with: JSON.encoder.encode(self))) as? [String: Any] ?? [:]
    }
}

