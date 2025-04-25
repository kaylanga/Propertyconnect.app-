import * as tf from '@tensorflow/tfjs';
import { OpenAI } from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

// Property price prediction model
export class PropertyPricePredictor {
  private model: tf.LayersModel | null = null;

  async loadModel() {
    // In a real app, load a pre-trained model from your server
    this.model = await tf.loadLayersModel('/models/property-price-predictor.json');
  }

  async predictPrice(features: number[]): Promise<number> {
    if (!this.model) await this.loadModel();
    
    const tensor = tf.tensor2d([features]);
    const prediction = this.model!.predict(tensor) as tf.Tensor;
    const price = await prediction.data();
    
    tensor.dispose();
    prediction.dispose();
    
    return price[0];
  }
}

// Property recommendation system
export async function getPropertyRecommendations(
  userPreferences: string,
  viewedProperties: string[]
): Promise<string[]> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a real estate recommendation expert."
        },
        {
          role: "user",
          content: `Based on these preferences: ${userPreferences} and previously viewed properties: ${viewedProperties.join(', ')}, suggest similar properties.`
        }
      ]
    });

    return response.choices[0].message.content?.split('\n') || [];
  } catch (error) {
    console.error('Error getting recommendations:', error);
    return [];
  }
}

// Property description enhancement
export async function enhancePropertyDescription(description: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a real estate copywriting expert."
        },
        {
          role: "user",
          content: `Enhance this property description while maintaining accuracy: ${description}`
        }
      ]
    });

    return response.choices[0].message.content || description;
  } catch (error) {
    console.error('Error enhancing description:', error);
    return description;
  }
}

// Location analysis
export async function analyzeLocation(location: string): Promise<{
  safety: number;
  amenities: string[];
  transportation: string[];
  growth_potential: number;
}> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a location analysis expert."
        },
        {
          role: "user",
          content: `Analyze this location in Uganda: ${location}`
        }
      ]
    });

    // Parse the response into structured data
    const analysis = JSON.parse(response.choices[0].message.content || '{}');
    
    return {
      safety: analysis.safety || 0,
      amenities: analysis.amenities || [],
      transportation: analysis.transportation || [],
      growth_potential: analysis.growth_potential || 0
    };
  } catch (error) {
    console.error('Error analyzing location:', error);
    return {
      safety: 0,
      amenities: [],
      transportation: [],
      growth_potential: 0
    };
  }
}