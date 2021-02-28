/* eslint-disable */
/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */
import { HTMLStencilElement, JSXBase } from "@stencil/core/internal";
import { MaterialIcons } from "./global/material-icons-enum";
import { MatchResults, RouterHistory } from "@stencil/router";
import { Line, Receipt } from "./components/model/client";
export namespace Components {
    interface AppButton {
        "primary": boolean;
    }
    interface AppButtonRound {
        "firstLine": string;
        "icon": MaterialIcons;
        "secondLine": string;
    }
    interface AppComponents {
    }
    interface AppCrop {
        "history": RouterHistory;
    }
    interface AppHome {
    }
    interface AppIcon {
    }
    interface AppLayoutVerticalSplit {
    }
    interface AppLogo {
    }
    interface AppProfile {
        "match": MatchResults;
    }
    interface AppQrGeneration {
    }
    interface AppQrScan {
    }
    interface AppReceiptExtraction {
    }
    interface AppReceiptLists {
        "history": RouterHistory;
    }
    interface AppRoot {
    }
    interface ReceiptLines {
        "receipt": Receipt;
    }
}
declare global {
    interface HTMLAppButtonElement extends Components.AppButton, HTMLStencilElement {
    }
    var HTMLAppButtonElement: {
        prototype: HTMLAppButtonElement;
        new (): HTMLAppButtonElement;
    };
    interface HTMLAppButtonRoundElement extends Components.AppButtonRound, HTMLStencilElement {
    }
    var HTMLAppButtonRoundElement: {
        prototype: HTMLAppButtonRoundElement;
        new (): HTMLAppButtonRoundElement;
    };
    interface HTMLAppComponentsElement extends Components.AppComponents, HTMLStencilElement {
    }
    var HTMLAppComponentsElement: {
        prototype: HTMLAppComponentsElement;
        new (): HTMLAppComponentsElement;
    };
    interface HTMLAppCropElement extends Components.AppCrop, HTMLStencilElement {
    }
    var HTMLAppCropElement: {
        prototype: HTMLAppCropElement;
        new (): HTMLAppCropElement;
    };
    interface HTMLAppHomeElement extends Components.AppHome, HTMLStencilElement {
    }
    var HTMLAppHomeElement: {
        prototype: HTMLAppHomeElement;
        new (): HTMLAppHomeElement;
    };
    interface HTMLAppIconElement extends Components.AppIcon, HTMLStencilElement {
    }
    var HTMLAppIconElement: {
        prototype: HTMLAppIconElement;
        new (): HTMLAppIconElement;
    };
    interface HTMLAppLayoutVerticalSplitElement extends Components.AppLayoutVerticalSplit, HTMLStencilElement {
    }
    var HTMLAppLayoutVerticalSplitElement: {
        prototype: HTMLAppLayoutVerticalSplitElement;
        new (): HTMLAppLayoutVerticalSplitElement;
    };
    interface HTMLAppLogoElement extends Components.AppLogo, HTMLStencilElement {
    }
    var HTMLAppLogoElement: {
        prototype: HTMLAppLogoElement;
        new (): HTMLAppLogoElement;
    };
    interface HTMLAppProfileElement extends Components.AppProfile, HTMLStencilElement {
    }
    var HTMLAppProfileElement: {
        prototype: HTMLAppProfileElement;
        new (): HTMLAppProfileElement;
    };
    interface HTMLAppQrGenerationElement extends Components.AppQrGeneration, HTMLStencilElement {
    }
    var HTMLAppQrGenerationElement: {
        prototype: HTMLAppQrGenerationElement;
        new (): HTMLAppQrGenerationElement;
    };
    interface HTMLAppQrScanElement extends Components.AppQrScan, HTMLStencilElement {
    }
    var HTMLAppQrScanElement: {
        prototype: HTMLAppQrScanElement;
        new (): HTMLAppQrScanElement;
    };
    interface HTMLAppReceiptExtractionElement extends Components.AppReceiptExtraction, HTMLStencilElement {
    }
    var HTMLAppReceiptExtractionElement: {
        prototype: HTMLAppReceiptExtractionElement;
        new (): HTMLAppReceiptExtractionElement;
    };
    interface HTMLAppReceiptListsElement extends Components.AppReceiptLists, HTMLStencilElement {
    }
    var HTMLAppReceiptListsElement: {
        prototype: HTMLAppReceiptListsElement;
        new (): HTMLAppReceiptListsElement;
    };
    interface HTMLAppRootElement extends Components.AppRoot, HTMLStencilElement {
    }
    var HTMLAppRootElement: {
        prototype: HTMLAppRootElement;
        new (): HTMLAppRootElement;
    };
    interface HTMLReceiptLinesElement extends Components.ReceiptLines, HTMLStencilElement {
    }
    var HTMLReceiptLinesElement: {
        prototype: HTMLReceiptLinesElement;
        new (): HTMLReceiptLinesElement;
    };
    interface HTMLElementTagNameMap {
        "app-button": HTMLAppButtonElement;
        "app-button-round": HTMLAppButtonRoundElement;
        "app-components": HTMLAppComponentsElement;
        "app-crop": HTMLAppCropElement;
        "app-home": HTMLAppHomeElement;
        "app-icon": HTMLAppIconElement;
        "app-layout-vertical-split": HTMLAppLayoutVerticalSplitElement;
        "app-logo": HTMLAppLogoElement;
        "app-profile": HTMLAppProfileElement;
        "app-qr-generation": HTMLAppQrGenerationElement;
        "app-qr-scan": HTMLAppQrScanElement;
        "app-receipt-extraction": HTMLAppReceiptExtractionElement;
        "app-receipt-lists": HTMLAppReceiptListsElement;
        "app-root": HTMLAppRootElement;
        "receipt-lines": HTMLReceiptLinesElement;
    }
}
declare namespace LocalJSX {
    interface AppButton {
        "onPress"?: (event: CustomEvent<MouseEvent>) => void;
        "primary"?: boolean;
    }
    interface AppButtonRound {
        "firstLine"?: string;
        "icon"?: MaterialIcons;
        "onPress"?: (event: CustomEvent<MouseEvent>) => void;
        "secondLine"?: string;
    }
    interface AppComponents {
    }
    interface AppCrop {
        "history"?: RouterHistory;
    }
    interface AppHome {
    }
    interface AppIcon {
    }
    interface AppLayoutVerticalSplit {
    }
    interface AppLogo {
    }
    interface AppProfile {
        "match"?: MatchResults;
    }
    interface AppQrGeneration {
    }
    interface AppQrScan {
    }
    interface AppReceiptExtraction {
    }
    interface AppReceiptLists {
        "history"?: RouterHistory;
    }
    interface AppRoot {
    }
    interface ReceiptLines {
        "onLineClick"?: (event: CustomEvent<Line>) => void;
        "receipt"?: Receipt;
    }
    interface IntrinsicElements {
        "app-button": AppButton;
        "app-button-round": AppButtonRound;
        "app-components": AppComponents;
        "app-crop": AppCrop;
        "app-home": AppHome;
        "app-icon": AppIcon;
        "app-layout-vertical-split": AppLayoutVerticalSplit;
        "app-logo": AppLogo;
        "app-profile": AppProfile;
        "app-qr-generation": AppQrGeneration;
        "app-qr-scan": AppQrScan;
        "app-receipt-extraction": AppReceiptExtraction;
        "app-receipt-lists": AppReceiptLists;
        "app-root": AppRoot;
        "receipt-lines": ReceiptLines;
    }
}
export { LocalJSX as JSX };
declare module "@stencil/core" {
    export namespace JSX {
        interface IntrinsicElements {
            "app-button": LocalJSX.AppButton & JSXBase.HTMLAttributes<HTMLAppButtonElement>;
            "app-button-round": LocalJSX.AppButtonRound & JSXBase.HTMLAttributes<HTMLAppButtonRoundElement>;
            "app-components": LocalJSX.AppComponents & JSXBase.HTMLAttributes<HTMLAppComponentsElement>;
            "app-crop": LocalJSX.AppCrop & JSXBase.HTMLAttributes<HTMLAppCropElement>;
            "app-home": LocalJSX.AppHome & JSXBase.HTMLAttributes<HTMLAppHomeElement>;
            "app-icon": LocalJSX.AppIcon & JSXBase.HTMLAttributes<HTMLAppIconElement>;
            "app-layout-vertical-split": LocalJSX.AppLayoutVerticalSplit & JSXBase.HTMLAttributes<HTMLAppLayoutVerticalSplitElement>;
            "app-logo": LocalJSX.AppLogo & JSXBase.HTMLAttributes<HTMLAppLogoElement>;
            "app-profile": LocalJSX.AppProfile & JSXBase.HTMLAttributes<HTMLAppProfileElement>;
            "app-qr-generation": LocalJSX.AppQrGeneration & JSXBase.HTMLAttributes<HTMLAppQrGenerationElement>;
            "app-qr-scan": LocalJSX.AppQrScan & JSXBase.HTMLAttributes<HTMLAppQrScanElement>;
            "app-receipt-extraction": LocalJSX.AppReceiptExtraction & JSXBase.HTMLAttributes<HTMLAppReceiptExtractionElement>;
            "app-receipt-lists": LocalJSX.AppReceiptLists & JSXBase.HTMLAttributes<HTMLAppReceiptListsElement>;
            "app-root": LocalJSX.AppRoot & JSXBase.HTMLAttributes<HTMLAppRootElement>;
            "receipt-lines": LocalJSX.ReceiptLines & JSXBase.HTMLAttributes<HTMLReceiptLinesElement>;
        }
    }
}