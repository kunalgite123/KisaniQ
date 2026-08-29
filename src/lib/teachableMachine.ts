import * as tmImage from "@teachablemachine/image";

export interface Prediction {
  className: string;
  probability: number;
}

export interface TMModel {
  predict: (imageElement: HTMLImageElement | HTMLCanvasElement | HTMLVideoElement) => Promise<Prediction[]>;
}

export async function loadTMModel(modelUrl: string): Promise<TMModel> {
  const cleanUrl = modelUrl.endsWith("/") ? modelUrl : `${modelUrl}/`;
  const modelPath = `${cleanUrl}model.json`;
  const metadataPath = `${cleanUrl}metadata.json`;

  const model = await tmImage.load(modelPath, metadataPath);

  return {
    predict: async (element: HTMLImageElement | HTMLCanvasElement | HTMLVideoElement) => {
      const results = await model.predict(element);
      return results.map((r: any) => ({
        className: r.className,
        probability: r.probability
      }));
    }
  };
}

export async function predict(
  model: TMModel,
  element: HTMLImageElement | HTMLCanvasElement | HTMLVideoElement
): Promise<Prediction[]> {
  return await model.predict(element);
}
