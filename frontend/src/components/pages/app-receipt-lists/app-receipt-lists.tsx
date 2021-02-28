import {Component, h, Host, Prop, State} from '@stencil/core';
import {ReceiptDto, ReceiptListElementDto, ReceiptStatusDto} from "../../model/dto";
import {groupBy} from "../../model/groupBy";
import {Inject} from "../../../global/di/inject";
import {GlobalStore} from "../../../global/global-store.service";
import {Mapper} from "../../model/mapper";
import {RouterHistory} from "@stencil/router";

@Component({
  tag: 'app-receipt-lists',
  styleUrl: 'app-receipt-lists.scss',
  shadow: true,
})
export class AppReceiptLists {

  @Inject(GlobalStore) private globalStore: GlobalStore;
  @Inject(Mapper) private mapper: Mapper;
  @Prop() history: RouterHistory;
  @State() receiptListHasBeenLoaded: boolean = false;

  private baseApiUrl: string = "http://localhost:8080/api"
  private receiptsNotDone: {[status: string]: ReceiptListElementDto[]} = {};

  async componentDidLoad() {
    await this.fetchReceiptsNotDone();
    this.receiptListHasBeenLoaded = true;
  }

  async fetchReceiptsNotDone(): Promise<void> {
    const receiptsNotDoneArray = await fetch(`${this.baseApiUrl}/receipt/not-done`, {
      method: 'GET'
    }).then(r => r.json());

    this.receiptsNotDone = groupBy(receiptsNotDoneArray, "status");
  }

  async fetchReceipt(id: number): Promise<ReceiptDto> {
    return await fetch(`${this.baseApiUrl}/receipt/${id}`, {
      method: 'GET'
    }).then(r => r.json());
  }

  getNextReceiptWithStatus(status: ReceiptStatusDto) {
    return this.receiptsNotDone[status][0];
  }

  countReceipts(status: ReceiptStatusDto): number {
    return this.receiptsNotDone[status]?.length ?? 0;
  }

  async continueEditingNextReceipt(status: ReceiptStatusDto) {
    const nextReceiptToEdit = this.getNextReceiptWithStatus(status);
    const receiptDto = await this.fetchReceipt(nextReceiptToEdit.id);
    const receipt = this.mapper.receiptFromDto(receiptDto)
    console.log(receipt);
    this.globalStore.setCurrentReceipt(receipt)
    this.history.push('/receipt-extraction')
  }

  render() {
    return (
      <Host>
        {this.receiptListHasBeenLoaded && <div>
        <span>you have {this.countReceipts(ReceiptStatusDto.Uploaded)} receipts uploaded</span>
          <app-button onPress={() => this.continueEditingNextReceipt(ReceiptStatusDto.Uploaded)} primary>Continue editing</app-button>
          <br />

          <span>you have {this.countReceipts(ReceiptStatusDto.Open)} receipts open</span>
          <app-button onPress={() => this.continueEditingNextReceipt(ReceiptStatusDto.Open)} primary>Continue editing</app-button>
          <br />

          <span>you have {this.countReceipts(ReceiptStatusDto.InProgress)} receipts in progress</span>
          <app-button onPress={() => this.continueEditingNextReceipt(ReceiptStatusDto.InProgress)} primary>Continue editing</app-button>
          <br />
        </div> }
      </Host>
    );
  }

}