export interface Department {
  id_departamento: number;
  departamento: string;
  web: boolean;
}

export interface Category {
  id_categoria: number;
  id_departamento: number;
  nombre: string;
  web: boolean;
}

export interface Product {
  id_producto: number;
  descripcion: string;
  codigo: string | null;
  info: string | null;
  id_departamento: number;
  id_categoria: number | null;
  activo: boolean;
  web: boolean | null;
}

export interface Moneda {
  id_moneda: number;
  nombre: string;
  siglas: string;
  por_defecto: boolean;
  taza_cambio: number;
}

export interface Precio {
  id_precio: number;
  id_producto: number;
  id_moneda: number;
  precio: number;
}

export interface ProductoImage {
  id_relacion: number;
  id_producto: number;
  nombre: string;
  ext: string
  principal: boolean
}

export interface Etiqueta {
  id_etiqueta: number;
  nombre: string;
  ficha_tecnica: boolean;
  interna: boolean;
}

export interface EtiquetaProducto {
  id_relacion: number;
  id_producto: number;
  id_etiqueta: number;
  valor: string;
}

export interface EtiquetaConValor extends Etiqueta {
  valor: string;
}


export interface ProductDetail extends Product {
  imageUrl?: string;
  precioUSD?: number;
  images?: string[];
  department: Department;
  category: Category | null;
  etiquetasFT: EtiquetaConValor[];
  etiquetasInt: EtiquetaConValor[];
}

/** Línea persistida en el carrito (localStorage). */
export interface CartLineItem {
  id_producto: number;
  descripcion: string;
  codigo: string | null;
  imageUrl?: string;
  /** Precio unitario en USD (misma lógica que precioUSD / precio en ficha). */
  unitPrice: number;
  quantity: number;
}

export interface DepartmentWithImage extends Department {
  imageUrl: string;
}
