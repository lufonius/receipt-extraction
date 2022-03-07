import {Component, h, Host, Prop, State} from '@stencil/core';
import {ReceiptDto, ReceiptListElementDto, ReceiptStatusDto} from "../../model/dto";
import {groupBy} from "../../model/groupBy";
import {Inject} from "../../../global/di/inject";
import {GlobalStore} from "../../../global/global-store.service";
import {Mapper} from "../../model/mapper";
import {RouterHistory} from "@stencil/router";
import {ReceiptService} from "../receipt.service";
import {Icons} from "../../../global/icons-enum";

@Component({
  tag: 'app-receipt-lists',
  styleUrl: 'app-receipt-lists.scss',
  shadow: true,
})
export class AppReceiptLists {

  @Inject(GlobalStore) private globalStore: GlobalStore;
  @Inject(Mapper) private mapper: Mapper;
  @Inject(ReceiptService) private receiptService: ReceiptService;

  @Prop() history: RouterHistory;
  @State() receiptListHasBeenLoaded: boolean = false;

  private baseApiUrl: string = "/api"
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

    if (status === ReceiptStatusDto.Open) {
      await this.receiptService.startExtraction(receiptDto.id);
    }

    const categories = this.globalStore.selectCategories()();
    const receipt = this.mapper.receiptFromDto(receiptDto, categories);
    this.globalStore.setCurrentReceipt(receipt);
    this.globalStore.setCategories(categories);
    this.history.push('/receipt-extraction');
  }

  private photoInput: HTMLInputElement;

  private redirectToImageEditing() {
    if (this.photoInput.files.length > 0) {
      this.history.push('/edit-image', { image: this.photoInput.files[0] });
    }
  }

  render() {
    return (
      <Host>
          <input style={({ display: "none" })}  type="file" accept="image/*" capture="camera" onChange={() => this.redirectToImageEditing()} ref={(el) => this.photoInput = el} />

          <div class="page-layout">
            <div class="header">
              <h1>Home</h1>
              <p>Use drezip to upload receipts, extract the items and categorise them.</p>
            </div>
            <div class="body">
              {this.receiptListHasBeenLoaded && <div>

                <div class="status-container">
                  <h4>Upload and extract infos</h4>
                  <app-button onPress={() => this.photoInput.click()} primary>
                    start
                    <div class="button-space" />
                    <app-icon icon={Icons.ARROW_RIGHT} />
                  </app-button>
                </div>

                <app-divider />

                <div class="status-container">
                  <h1>{this.countReceipts(ReceiptStatusDto.Open)}</h1>
                  <h4>Receipts ready for extraction</h4>
                  <app-button onPress={() => this.continueEditingNextReceipt(ReceiptStatusDto.Open)} primary>
                    Extract infos
                    <div class="button-space" />
                    <app-icon icon={Icons.ARROW_RIGHT} />
                  </app-button>
                </div>

                <app-divider />

                <div class="status-container">
                  <h1>{this.countReceipts(ReceiptStatusDto.InProgress)}</h1>
                  <h4>Receipts in progress</h4>
                  <app-button onPress={() => this.continueEditingNextReceipt(ReceiptStatusDto.InProgress)} primary>
                    Continue extraction
                    <div class="button-space" />
                    <app-icon icon={Icons.ARROW_RIGHT} />
                  </app-button>
                </div>
              </div>}
            </div>
          </div>

        <app-navbar activeUrl="/" history={this.history} />
      </Host>
    );
  }

}
