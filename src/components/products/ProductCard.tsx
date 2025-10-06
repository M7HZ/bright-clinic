import { ShoppingCart, Plus, Minus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  stock_quantity: number;
  category: string;
}

interface ProductCardProps {
  product: Product;
  onAddToCart?: (productId: string, quantity: number) => void;
  cartQuantity?: number;
}

export const ProductCard = ({ product, onAddToCart, cartQuantity = 0 }: ProductCardProps) => {
  return (
    <Card className="overflow-hidden h-full bg-card/50 backdrop-blur border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
      <div className="aspect-square bg-white">
        <img
          src={product.image_url || "/placeholder.svg"}
          alt={product.name}
          className="w-full h-full object-contain p-8"
        />
      </div>
      <div className="p-6 space-y-4">
        <div className="space-y-2">
          {product.category && (
            <Badge variant="outline" className="text-xs">
              {product.category}
            </Badge>
          )}
          <h3 className="text-xl font-semibold">{product.name}</h3>
          <p className="text-muted-foreground text-sm">{product.description}</p>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-primary">
            ${product.price.toFixed(2)}
          </span>
          <div className="text-sm text-muted-foreground">
            Stock: {product.stock_quantity}
          </div>
        </div>

        {onAddToCart && (
          <div className="flex items-center gap-2">
            {cartQuantity > 0 ? (
              <div className="flex items-center gap-2 w-full">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onAddToCart(product.id, cartQuantity - 1)}
                  disabled={cartQuantity <= 0}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <div className="flex-1 text-center font-semibold">{cartQuantity}</div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onAddToCart(product.id, cartQuantity + 1)}
                  disabled={cartQuantity >= product.stock_quantity}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Button
                size="sm"
                className="w-full gap-2"
                onClick={() => onAddToCart(product.id, 1)}
                disabled={product.stock_quantity === 0}
              >
                <ShoppingCart className="h-4 w-4" />
                Add to Cart
              </Button>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};