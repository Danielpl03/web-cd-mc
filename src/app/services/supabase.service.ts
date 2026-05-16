import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../environment';
import {
  Department,
  Category,
  Product,
  DepartmentWithImage,
  Precio,
  ProductoImage,
  Etiqueta,
  EtiquetaProducto,
  EtiquetaConValor,
  ProductDetail,
  Sugerencia,
} from '../models/store.models';

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private supabase: SupabaseClient;

  // Cache for prices (keyed by product ID)
  private pricesCache = new Map<number, number>();
  private pricesCacheLoaded = false;

  private mainImageCache = new Map<number, string>();
  private imagesCache = new Map<number, string[]>();

  private mainImageCacheLoaded = false;
  private imagesCacheLoaded = false;

  private etiquetasFT = new Map<number, Etiqueta>();
  private etiquetasInt = new Map<number, Etiqueta>();

  private etiquetasFTLoaded = false;
  private etiquetasIntLoaded = false;

  private departamentos = new Map<number, Department>();
  private departamentosLoaded = false;

  private categorias = new Map<number, Category>();
  private categoriasLoaded = false;

  // Cache for products by department
  private productsByDepartmentCache = new Map<number, ProductDetail[]>();

  // USD currency ID
  private readonly USD_MONEDA_ID = 2;

  /** Tamaño máx. de `in()` por petición (evita URLs largas y timeouts). */
  private readonly IN_CHUNK_SIZE = 120;

  constructor() {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey,
    );
  }

  // Preload etiquetas
  async preloadEtiquetas(): Promise<void> {
    await Promise.all([
      (async () => {
        if (this.etiquetasIntLoaded) return;
        const { data, error } = await this.supabase
          .from('etiquetas')
          .select('*')
          .eq('interna', true);

        if (!error && data) {
          (data as Etiqueta[]).forEach((e) => {
            this.etiquetasInt.set(e.id_etiqueta, e);
          });
          this.etiquetasIntLoaded = true;
        }
      })(),
      (async () => {
        if (this.etiquetasFTLoaded) return;
        const { data, error } = await this.supabase
          .from('etiquetas')
          .select('*')
          .eq('ficha_tecnica', true);

        if (!error && data) {
          (data as Etiqueta[]).forEach((e) => {
            this.etiquetasFT.set(e.id_etiqueta, e);
          });
          this.etiquetasFTLoaded = true;
        }
      })(),
    ]);
  }

  // Preload all USD prices into cache
  async preloadImages(): Promise<void> {
    if (!this.mainImageCacheLoaded) {
      const { data, error } = await this.supabase
        .from('productos_imagenes')
        .select('id_relacion, id_producto, principal, nombre')
        .eq('principal', true);

      if (!error && data) {
        (data as ProductoImage[]).forEach((p) => {
          this.mainImageCache.set(
            p.id_producto,
            this.getProductImageUrl(
              this.parseName(p.nombre) + '_' + p.id_relacion,
            ),
          );
        });
        this.mainImageCacheLoaded = true;
      }
    }

    if (!this.imagesCacheLoaded) {
      const { data, error } = await this.supabase
        .from('productos_imagenes')
        .select('id_relacion, id_producto, principal, nombre')
        .eq('principal', false);

      if (!error && data) {
        (data as ProductoImage[]).forEach((p) => {
          var imag = this.imagesCache.get(p.id_producto);
          if (imag == undefined) {
            imag = [];
          }
          imag.push(
            this.getProductImageUrl(
              this.parseName(p.nombre) + '_' + p.id_relacion,
            ),
          );
          this.imagesCache.set(p.id_producto, imag);
        });

        this.imagesCacheLoaded = true;
      }
    }
  }

  // Preload all USD prices into cache
  async preloadPrices(): Promise<void> {
    if (this.pricesCacheLoaded) return;

    const { data, error } = await this.supabase
      .from('precios')
      .select('id_producto, precio')
      .eq('id_moneda', this.USD_MONEDA_ID);

    if (!error && data) {
      (data as Precio[]).forEach((p) => {
        this.pricesCache.set(p.id_producto, Math.ceil(p.precio));
      });
      this.pricesCacheLoaded = true;
    }
  }

  async preloadDepartments(): Promise<void> {
    if (this.departamentosLoaded) return;

    const { data, error } = await this.supabase
      .from('departamentos')
      .select('*')
      .order('orden');

    if (!error && data) {
      (data as Department[]).forEach((d) => {
        this.departamentos.set(d.id_departamento, d);
      });
      this.departamentosLoaded = true;
    }
  }

  async preloadCategorys(): Promise<void> {
    if (this.categoriasLoaded) return;

    const { data, error } = await this.supabase.from('categorias').select('*');

    if (!error && data) {
      (data as Category[]).forEach((c) => {
        this.categorias.set(c.id_categoria, c);
      });
      this.categoriasLoaded = true;
    }
  }

  private chunkIds<T>(ids: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < ids.length; i += size) {
      chunks.push(ids.slice(i, i + size));
    }
    return chunks;
  }

  /**
   * Rellena caché de imágenes solo para los productos indicados (evita cargar todo el catálogo).
   */
  async hydrateImageCacheForProductIds(productIds: number[]): Promise<void> {
    const unique = [...new Set(productIds)];
    if (unique.length === 0) return;

    for (const chunk of this.chunkIds(unique, this.IN_CHUNK_SIZE)) {
      const { data, error } = await this.supabase
        .from('productos_imagenes')
        .select('id_relacion, id_producto, principal, nombre')
        .in('id_producto', chunk)
        .order('id_relacion');

      if (error) {
        console.error('Error fetching productos_imagenes (batch):', error);
        continue;
      }
      if (!data?.length) continue;

      const byPid = new Map<number, ProductoImage[]>();
      for (const row of data as ProductoImage[]) {
        const list = byPid.get(row.id_producto) ?? [];
        list.push(row);
        byPid.set(row.id_producto, list);
      }

      for (const [, rows] of byPid) {
        const secondary: string[] = [];
        for (const p of rows) {
          const url = this.getProductImageUrl(
            this.parseName(p.nombre) + '_' + p.id_relacion,
          );
          if (p.principal) {
            this.mainImageCache.set(p.id_producto, url);
          } else {
            secondary.push(url);
          }
        }
        const pid = rows[0].id_producto;
        if (secondary.length > 0) {
          this.imagesCache.set(pid, secondary);
        }
      }
    }
  }

  /**
   * Etiquetas para muchos productos en pocas consultas (reemplaza N llamadas a getProductEtiquetas).
   * Requiere `preloadEtiquetas()` previo.
   */
  private async getProductEtiquetasForProducts(
    productIds: number[],
  ): Promise<Map<number, Map<string, EtiquetaConValor[]>>> {
    const mkEmpty = (): Map<string, EtiquetaConValor[]> => {
      const m = new Map<string, EtiquetaConValor[]>();
      m.set('ficha_tecnica', []);
      m.set('interna', []);
      return m;
    };

    const unique = [...new Set(productIds)];
    const result = new Map<number, Map<string, EtiquetaConValor[]>>();
    for (const id of unique) {
      result.set(id, mkEmpty());
    }

    if (unique.length === 0) return result;

    for (const chunk of this.chunkIds(unique, this.IN_CHUNK_SIZE)) {
      const { data, error } = await this.supabase
        .from('etiquetas_productos')
        .select('id_producto, id_etiqueta, valor')
        .in('id_producto', chunk);

      if (error) {
        console.error('Error fetching etiquetas_productos (batch):', error);
        continue;
      }
      if (!data?.length) continue;

      for (const row of data as Pick<
        EtiquetaProducto,
        'id_producto' | 'id_etiqueta' | 'valor'
      >[]) {
        const bucket = result.get(row.id_producto);
        if (!bucket) continue;
        if (this.etiquetasFT.has(row.id_etiqueta)) {
          bucket.get('ficha_tecnica')!.push({
            ...this.etiquetasFT.get(row.id_etiqueta)!,
            valor: row.valor,
          });
        }
        if (this.etiquetasInt.has(row.id_etiqueta)) {
          bucket.get('interna')!.push({
            ...this.etiquetasInt.get(row.id_etiqueta)!,
            valor: row.valor,
          });
        }
      }
    }

    return result;
  }

  // Get price from cache
  getPriceUSD(productId: number): number | undefined {
    return this.pricesCache.get(productId);
  }

  // Get main image from cache
  getImageUrl(productId: number): string | undefined {
    var img = this.mainImageCache.get(productId);
    if (img != undefined) {
      return img;
    }
    return this.imagesCache.get(productId)?.at(0);
  }

  // Get gallery images from cache
  getImagesUrls(productId: number): string[] | undefined {
    return this.imagesCache.get(productId);
  }

  // Get public URL for product image (format: 'nombre -codigo')
  getProductImageUrl(imageName: string): string {
    const { data } = this.supabase.storage
      .from(environment.bucketName)
      .getPublicUrl(imageName);
    return data.publicUrl;
  }

  // Parse name for image name
  parseNameProduct(descripcion: string, codigo?: string | null): string {
    let finalDesc = codigo ? descripcion + ' -' + codigo : descripcion;
    return this.parseName(finalDesc);
  }

  parseName(name: string) {
    const caracteres = '<>:\"/\\|?*ÁÉÍÓÚÜÑ¨´ñ`';
    name = name
      .toUpperCase()
      .split('')
      .map((c) => (caracteres.includes(c) ? '_' : c))
      .join('');
    return name.replace(/ /g, '_').toUpperCase();
  }

  // Get public URL for department image (same name as department)
  getDepartmentImageUrl(department: Department): string {
    const { data } = this.supabase.storage
      .from(environment.bucketName)
      .getPublicUrl(this.parseName(department.departamento));
    return data.publicUrl;
  }

  // Fetch all web-enabled departments
  async getDepartments(): Promise<DepartmentWithImage[]> {
    if (this.departamentosLoaded) {
      let deps: Department[] = [];
      this.departamentos.forEach((k, _) => deps.push(k));

      return deps.filter(d => d.web).map((dep) => ({
        ...dep,
        imageUrl: this.getDepartmentImageUrl(dep),
      }));
    }

    const { data, error } = await this.supabase
      .from('departamentos')
      .select('*')
      .eq('web', true)
      .order('orden');

    if (error) {
      console.error('Error fetching departments:', error);
      return [];
    }

    if (!error && data) {
      (data as Department[]).forEach((d) => {
        this.departamentos.set(d.id_departamento, d);
      });
      this.departamentosLoaded = true;
    }

    return (data as Department[]).map((dept) => ({
      ...dept,
      imageUrl: this.getDepartmentImageUrl(dept),
    }));
  }

  // Fetch categories for a department
  async getCategoriesByDepartment(departmentId: number): Promise<Category[]> {
    const { data, error } = await this.supabase
      .from('categorias')
      .select('*')
      .eq('id_departamento', departmentId)
      .eq('web', true)
      .order('nombre');

    if (error) {
      console.error('Error fetching categories:', error);
      return [];
    }

    return data as Category[];
  }

  // Fetch department by ID
  async getDepartmentById(id: number): Promise<DepartmentWithImage | null> {
    this.departamentos;

    const { data, error } = await this.supabase
      .from('departamentos')
      .select('*')
      .eq('id_departamento', id)
      .single();

    if (error) {
      console.error('Error fetching department:', error);
      return null;
    }

    const dept = data as Department;
    return {
      ...dept,
      imageUrl: this.getDepartmentImageUrl(dept),
    };
  }

  // Fetch category by ID
  async getCategoryById(id: number): Promise<Category | null> {
    if (this.categorias.has(id)) return this.categorias.get(id) ?? null;
    const { data, error } = await this.supabase
      .from('categorias')
      .select('*')
      .eq('id_categoria', id)
      .single();

    if (error) {
      console.error('Error fetching category:', error);
      return null;
    }

    return data as Category;
  }

  // Fetch products by department with caching and optimized price loading
  async getProductsByDepartment(
    departmentId: number,
  ): Promise<ProductDetail[]> {
    // Check cache first
    if (this.productsByDepartmentCache.has(departmentId)) {
      return this.productsByDepartmentCache.get(departmentId)!;
    }

    // Ensure metadata caches (sin escanear todas las imágenes del catálogo)
    await Promise.all([
      this.preloadPrices(),
      this.preloadEtiquetas(),
      this.preloadCategorys(),
      this.preloadDepartments(),
    ]);

    const { data, error } = await this.supabase
      .from('productos')
      .select(
        'id_producto, descripcion, info, codigo, id_departamento, id_categoria, activo, web',
      )
      .eq('id_departamento', departmentId)
      .eq('activo', true)
      .eq('web', true)
      .order('descripcion');

    if (error) {
      console.error('Error fetching products:', error);
      return [];
    }

    const plist = data as Product[];
    const ids = plist.map((p) => p.id_producto);

    await this.hydrateImageCacheForProductIds(ids);
    const etiquetasByProduct = await this.getProductEtiquetasForProducts(ids);

    const finalProducts: ProductDetail[] = plist.map((p) => {
      const etiquetas = etiquetasByProduct.get(p.id_producto)!;
      return {
        ...p,
        imageUrl: this.getImageUrl(p.id_producto),
        images: this.getImagesUrls(p.id_producto),
        precioUSD: this.getPriceUSD(p.id_producto),
        etiquetasFT: etiquetas.get('ficha_tecnica') ?? [],
        etiquetasInt: etiquetas.get('interna') ?? [],
        department: this.departamentos.get(p.id_departamento)!,
        category: p.id_categoria
          ? (this.categorias.get(p.id_categoria) ?? null)
          : null,
      };
    });

    // Cache the results
    this.productsByDepartmentCache.set(departmentId, finalProducts);

    return finalProducts;
  }

  // Fetch products by category with optimized price loading
  async getProductsByCategory(categoryId: number): Promise<ProductDetail[]> {
    await Promise.all([
      this.preloadPrices(),
      this.preloadEtiquetas(),
      this.preloadCategorys(),
      this.preloadDepartments(),
    ]);

    const { data, error } = await this.supabase
      .from('productos')
      .select(
        'id_producto, descripcion, codigo, info, id_departamento, id_categoria, activo, web',
      )
      .eq('id_categoria', categoryId)
      .eq('activo', true)
      .eq('web', true)
      .order('descripcion');

    if (error) {
      console.error('Error fetching products:', error);
      return [];
    }

    const plist = data as Product[];
    const ids = plist.map((p) => p.id_producto);

    await this.hydrateImageCacheForProductIds(ids);
    const etiquetasByProduct = await this.getProductEtiquetasForProducts(ids);

    return plist.map((p) => {
      const etiquetas = etiquetasByProduct.get(p.id_producto)!;
      return {
        ...p,
        imageUrl: this.getImageUrl(p.id_producto),
        precioUSD: this.getPriceUSD(p.id_producto),
        images: this.getImagesUrls(p.id_producto),
        etiquetasFT: etiquetas.get('ficha_tecnica') ?? [],
        etiquetasInt: etiquetas.get('interna') ?? [],
        department: this.departamentos.get(p.id_departamento)!,
        category: p.id_categoria
          ? (this.categorias.get(p.id_categoria) ?? null)
          : null,
      };
    });
  }

  // Search products across all departments and categories
  async searchProducts(query: string): Promise<ProductDetail[]> {
    await Promise.all([
      this.preloadPrices(),
      this.preloadEtiquetas(),
      this.preloadCategorys(),
      this.preloadDepartments(),
    ]);

    const { data, error } = await this.supabase
      .from('productos')
      .select(
        'id_producto, descripcion, codigo, info, id_departamento, id_categoria, activo, web',
      )
      .eq('activo', true)
      .eq('web', true)
      .or(`descripcion.ilike.%${query}%,codigo.ilike.%${query}%`)
      .order('descripcion')
      .limit(50);

    if (error) {
      console.error('Error searching products:', error);
      return [];
    }

    const plist = data as Product[];
    const ids = plist.map((p) => p.id_producto);

    await this.hydrateImageCacheForProductIds(ids);
    const etiquetasByProduct = await this.getProductEtiquetasForProducts(ids);

    return plist.map((p) => {
      const etiquetas = etiquetasByProduct.get(p.id_producto)!;
      return {
        ...p,
        imageUrl: this.getImageUrl(p.id_producto),
        precioUSD: this.getPriceUSD(p.id_producto),
        images: this.getImagesUrls(p.id_producto),
        etiquetasFT: etiquetas.get('ficha_tecnica') ?? [],
        etiquetasInt: etiquetas.get('interna') ?? [],
        department: this.departamentos.get(p.id_departamento)!,
        category: p.id_categoria
          ? (this.categorias.get(p.id_categoria) ?? null)
          : null,
      };
    });
  }

  // Clear caches (useful for refresh)
  clearCache(): void {
    this.productsByDepartmentCache.clear();
    this.pricesCache.clear();
    this.pricesCacheLoaded = false;
  }

  // Get image URL from productos_images table
  getImageUrlFromName(productoImage: ProductoImage, product: Product): string {
    const imageName = `${this.parseNameProduct(product.descripcion, product.codigo)}_${productoImage.id_relacion}`;
    const { data } = this.supabase.storage
      .from(environment.bucketName)
      .getPublicUrl(imageName);
    return data.publicUrl;
  }

  // Fetch product images from productos_images table
  async getProductImages(product: Product): Promise<ProductoImage[]> {
    const { data, error } = await this.supabase
      .from('productos_imagenes')
      .select('id_relacion, principal')
      .eq('id_producto', product.id_producto);

    if (error || !data) {
      console.error('Error fetching product images:', error);
      return [];
    }

    return data as ProductoImage[];
  }

  getUrlImagesFromProductoImages(
    productoImage: ProductoImage,
    product: Product,
  ) {
    return this.getImageUrlFromName(productoImage, product);
  }

  // Fetch product etiquetas (only ficha_tecnica = true)
  async getProductEtiquetas(
    productId: number,
  ): Promise<Map<string, EtiquetaConValor[]>> {
    const { data: relacionData, error: relacionError } = await this.supabase
      .from('etiquetas_productos')
      .select('id_etiqueta, valor')
      .eq('id_producto', productId);

    if (relacionError || !relacionData || relacionData.length === 0) {
      return new Map();
    }

    const eFT: EtiquetaConValor[] = (relacionData as EtiquetaProducto[])
      .filter((r) => this.etiquetasFT.has(r.id_etiqueta))
      .map((r) => ({
        ...this.etiquetasFT.get(r.id_etiqueta)!,
        valor: r.valor,
      }));

    const eInt: EtiquetaConValor[] = (relacionData as EtiquetaProducto[])
      .filter((r) => this.etiquetasInt.has(r.id_etiqueta))
      .map((r) => ({
        ...this.etiquetasInt.get(r.id_etiqueta)!,
        valor: r.valor,
      }));

    let map = new Map<string, EtiquetaConValor[]>();
    map.set('ficha_tecnica', eFT);
    map.set('interna', eInt);

    return map;
  }

  // Fetch product by ID
  async getProductById(id: number): Promise<Product | null> {
    const { data, error } = await this.supabase
      .from('productos')
      .select('*')
      .eq('id_producto', id)
      .single();

    if (error) {
      console.error('Error fetching product:', error);
      return null;
    }

    return data as Product;
  }

  /**
   * Productos recomendados: relación bidireccional desde `sugerencias`.
   * - Filas con `id_producto` = producto actual → se muestra `id_producto_sugerido`.
   * - Filas con `id_producto_sugerido` = producto actual → se muestra `id_producto`.
   * Orden: primero sugerencias “directas”, luego las inversas; sin duplicados.
   */
  async getRecommendedProductDetails(
    productId: number,
  ): Promise<ProductDetail[]> {
    const selectCols =
      'id_sugerencia, id_producto, id_producto_sugerido';

    const [forwardRes, inverseRes] = await Promise.all([
      this.supabase
        .from('sugerencias')
        .select(selectCols)
        .eq('id_producto', productId)
        .order('id_sugerencia', { ascending: true }),
      this.supabase
        .from('sugerencias')
        .select(selectCols)
        .eq('id_producto_sugerido', productId)
        .order('id_sugerencia', { ascending: true }),
    ]);

    if (forwardRes.error) {
      console.error('Error fetching sugerencias (directas):', forwardRes.error);
    }
    if (inverseRes.error) {
      console.error(
        'Error fetching sugerencias (inversas):',
        inverseRes.error,
      );
    }

    const forward = (forwardRes.data ?? []) as Sugerencia[];
    const inverse = (inverseRes.data ?? []) as Sugerencia[];

    if (forward.length === 0 && inverse.length === 0) {
      return [];
    }

    const orderedIds: number[] = [];
    const seen = new Set<number>();

    const pushId = (id: number) => {
      if (id === productId || seen.has(id)) return;
      seen.add(id);
      orderedIds.push(id);
    };

    for (const r of forward) {
      pushId(r.id_producto_sugerido);
    }
    for (const r of inverse) {
      pushId(r.id_producto);
    }

    if (orderedIds.length === 0) return [];

    await Promise.all([
      this.preloadPrices(),
      this.preloadEtiquetas(),
      this.preloadCategorys(),
      this.preloadDepartments(),
    ]);
    await this.hydrateImageCacheForProductIds(orderedIds);
    const etiquetasByProduct =
      await this.getProductEtiquetasForProducts(orderedIds);

    const { data: productRows, error: productsError } = await this.supabase
      .from('productos')
      .select(
        'id_producto, descripcion, info, codigo, id_departamento, id_categoria, activo, web',
      )
      .in('id_producto', orderedIds)
      .eq('activo', true)
      .eq('web', true);

    if (productsError || !productRows?.length) {
      if (productsError) {
        console.error('Error fetching recommended productos:', productsError);
      }
      return [];
    }

    const byId = new Map(
      (productRows as Product[]).map((p) => [p.id_producto, p]),
    );
    const result: ProductDetail[] = [];

    for (const id of orderedIds) {
      const product = byId.get(id);
      if (!product) continue;
      const etiquetas = etiquetasByProduct.get(id)!;
      result.push({
        ...product,
        imageUrl: this.getImageUrl(id),
        precioUSD: this.getPriceUSD(id),
        images: this.getImagesUrls(id),
        etiquetasFT: etiquetas.get('ficha_tecnica') ?? [],
        etiquetasInt: etiquetas.get('interna') ?? [],
        department: this.departamentos.get(product.id_departamento)!,
        category: product.id_categoria
          ? (this.categorias.get(product.id_categoria) ?? null)
          : null,
      });
    }

    return result;
  }

  // Fetch complete product detail
  async getProductDetail(productId: number): Promise<ProductDetail | null> {
    await Promise.all([
      this.preloadPrices(),
      this.preloadEtiquetas(),
      this.preloadCategorys(),
      this.preloadDepartments(),
    ]);
    await this.hydrateImageCacheForProductIds([productId]);

    const product = await this.getProductById(productId);
    if (!product) return null;

    const etiquetas = await this.getProductEtiquetas(productId);

    return {
      ...product,
      imageUrl: this.getImageUrl(productId),
      precioUSD: this.getPriceUSD(productId),
      images: this.getImagesUrls(productId),
      etiquetasFT: etiquetas.get('ficha_tecnica') ?? [],
      etiquetasInt: etiquetas.get('interna') ?? [],
      department: this.departamentos.get(product.id_departamento)!,
      category: product.id_categoria
        ? (this.categorias.get(product.id_categoria) ?? null)
        : null,
    };
  }
}
