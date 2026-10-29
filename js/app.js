import { PRODUCTOS } from '../datos/productos.js';
import { CONFIG } from '../datos/config.js';

const $ = (selector, parent = document) => parent.querySelector(selector);
const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];
const dinero = (valor) => `${CONFIG.nombreMoneda} ${Number(valor || 0).toFixed(2)}`;
const safe = (value) => String(value ?? '').replace(/[&<>"']/g, char => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[char]));
const limpio = value => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
const storageGet = (key, fallback) => { try { const val = JSON.parse(localStorage.getItem(key)); return val ?? fallback; } catch { return fallback; } };
const storageSet = (key, value) => { try { localStorage.setItem(key, JSON.stringify(value)); } catch {} };

let carrito = storageGet('tuki_carrito_v1', []);
let favoritos = storageGet('tuki_favoritos_v1', []);
let filtro = 'todos';
let orden = 'recomendados';
let busqueda = '';
let soloFavoritos = false;
let productoActual = null;
let lastFocus = null;
let toastTimeout = null;
const LISTA_CATEGORIAS = { mascotas: 'Mascotas', lavanderia: 'Lavandería', hogar:'Hogar & cocina', belleza:'Belleza' };

function varianteDe(producto, vid){ return producto?.variantes.find(v => v.id === vid) || producto?.variantes[0]; }
function itemValido(item){ return PRODUCTOS.some(p => p.id === item.id && !p.proximamente && p.variantes.some(v => v.id === item.varianteId)); }
carrito = Array.isArray(carrito) ? carrito.filter(itemValido).map(item => ({...item, cantidad: Math.max(1, Math.min(99, Number(item.cantidad) || 1))})) : [];
favoritos = Array.isArray(favoritos) ? favoritos : [];

function persistir(){ storageSet('tuki_carrito_v1', carrito); actualizarContador(); }
function actualizarContador(){ const cant=carrito.reduce((n, i)=>n+i.cantidad,0); $('#cart-count').textContent = cant>99?'99+':String(cant); }
function toast(texto){ const node=$('#toast');node.textContent=texto;node.classList.add('show');clearTimeout(toastTimeout);toastTimeout=setTimeout(()=>node.classList.remove('show'),2900); }
function whatsapp(texto){ return `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(texto)}`; }
function abrirWhatsapp(texto){ window.open(whatsapp(texto), '_blank', 'noopener,noreferrer'); }
function promoVigente(){ return Date.now() <= Date.parse(CONFIG.fechaFinPromocion); }

function obtenerProductos(){
  let list=PRODUCTOS.filter(p => filtro==='todos' || p.categoria===filtro);
  if(busqueda){ const q=limpio(busqueda);list=list.filter(p=>limpio([p.nombre,p.marca,p.categoria,p.tipo,p.descripcion,...p.variantes.map(v=>v.nombre)].join(' ')).includes(q)); }
  if(soloFavoritos) list=list.filter(p=>favoritos.includes(p.id));
  if(orden==='precio-asc') list.sort((a,b)=>(a.proximamente?Infinity:a.variantes[0].precio)-(b.proximamente?Infinity:b.variantes[0].precio));
  else if(orden==='precio-desc') list.sort((a,b)=>(b.proximamente?-1:b.variantes[0].precio)-(a.proximamente?-1:a.variantes[0].precio));
  else if(orden==='nombre') list.sort((a,b)=>a.nombre.localeCompare(b.nombre,'es'));
  else list.sort((a,b)=>Number(!!b.destacado)-Number(!!a.destacado));
  return list;
}

function renderProductos(){
  const list=obtenerProductos();
  $('#contador-resultados').textContent=`${list.length} ${list.length===1?'resultado':'resultados'} encontrados`;
  $('#sin-resultados').hidden=list.length!==0;
  $('#restablecer').hidden=!busqueda && filtro==='todos' && !soloFavoritos;
  $('#productos-grid').innerHTML=list.map(p=>{
    const v=p.variantes[0], fav=favoritos.includes(p.id),soon=!!p.proximamente;
    return `<article class="product-card" data-id="${safe(p.id)}">
       <div class="product-image ${soon?'coming':''}"><img src="${safe(p.imagen)}" alt="${safe(p.nombre)}${p.real?', foto original':''}" loading="lazy"/>
        ${p.etiqueta?`<span class="product-tag">${safe(p.etiqueta)}</span>`:''}
        <button class="favorite ${fav?'is-saved':''}" type="button" aria-pressed="${fav}" aria-label="${fav?'Quitar de':'Añadir a'} favoritos: ${safe(p.nombre)}" data-fav="${safe(p.id)}">${fav?'♥':'♡'}</button>
       </div>
       <div class="product-card-body"><span class="product-brand">${safe(p.marca)} · ${safe(LISTA_CATEGORIAS[p.categoria])}</span><h3>${safe(p.nombre)}</h3><p class="product-desc">${safe(p.descripcion)}</p>
         <div class="variant-hint">${soon?'Disponible en el futuro':p.variantes.length>1?`${p.variantes.length} presentaciones para elegir`:safe(v.nombre)}</div>
         <div class="card-foot"><div class="card-price">${soon?'Muy pronto':dinero(v.precio)}${p.variantes.length>1 && !soon?'<small>Desde</small>':''}</div><span class="demo-chip">${soon?'No disponible':p.real?'Bolsa real':'Imagen referencial'}</span></div>
         <button type="button" class="add-btn" data-open-product="${safe(p.id)}" ${soon?'disabled aria-disabled="true"':''}>${soon?'✦ Próximamente':p.variantes.length>1?'Elegir presentación +':'Agregar al carrito +'}</button>
       </div></article>`;
  }).join('');
}

function aplicarFiltro(nuevo, scroll=true){
  filtro=nuevo;
  $$('.filter-tab').forEach(b=>{const active=b.dataset.filter===filtro;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});
  renderProductos();
  if(scroll) $('#catalogo').scrollIntoView({behavior:'smooth',block:'start'});
}
function limpiarFiltros(){busqueda='';filtro='todos';orden='recomendados';soloFavoritos=false;$('#buscar').value='';$('#limpiar-busqueda').hidden=true;$('#ordenar').value='recomendados';$('#solo-favoritos').classList.remove('is-active');$('#solo-favoritos').setAttribute('aria-pressed','false');aplicarFiltro('todos',false);}

function mostrarOverlay(dialogo){ lastFocus=document.activeElement;$('#overlay').hidden=false;document.body.classList.add('no-scroll');dialogo.classList.add('open');dialogo.setAttribute('aria-hidden','false');setTimeout(()=>dialogo.focus(),30); }
function cerrarDialogos(){ $('#overlay').hidden=true;document.body.classList.remove('no-scroll');for(const el of [$('#carrito'),$('#producto-modal')]){el.classList.remove('open');el.setAttribute('aria-hidden','true');}lastFocus?.focus?.(); }
function abrirCarrito(){cerrarDialogos();renderCarrito();mostrarOverlay($('#carrito'));}
function abrirProducto(id){
 const p=PRODUCTOS.find(item=>item.id===id); if(!p || p.proximamente)return;
 productoActual=p;
 const v=p.variantes[0];
 $('#modal-body').innerHTML=`<div class="modal-layout">
  <div class="modal-visual"><img id="modal-img" src="${safe(v.imagen || p.imagen)}" alt="${safe(p.nombre)}" /></div>
  <div class="modal-copy"><span class="kicker">${safe(p.marca)} · ${safe(p.tipo)}</span><h2>${safe(p.nombre)}</h2><p>${safe(p.descripcion)}</p>
    <label>Presentación <select id="modal-variant">${p.variantes.map(v=>`<option value="${safe(v.id)}">${safe(v.nombre)}</option>`).join('')}</select></label>
    <p id="modal-gift" class="gift-message" ${!v.palaGratis?'hidden':''}>🎁 Incluye una pala sanitaria de regalo (sujeta a stock)</p>
    <div class="modal-price" id="modal-price">${dinero(v.precio)}</div>
    <p class="modal-demonstration">Precio demostrativo. ${p.real?'Foto real del empaque TUKI.':'Imagen de referencia, no corresponde necesariamente al envase comercial.'}</p>
    <button type="button" class="btn btn-teal modal-add" id="modal-add">🛒 Agregar al carrito +</button>
  </div></div>`;
 $('#modal-variant').addEventListener('change',e=>{
   const variante=varianteDe(p,e.target.value);
   $('#modal-img').src=variante.imagen || p.imagen;
   $('#modal-price').textContent=dinero(variante.precio);
   $('#modal-gift').hidden=!variante.palaGratis;
 });
 $('#modal-add').addEventListener('click',()=>{agregarItem(p.id,$('#modal-variant').value);cerrarDialogos();});
 mostrarOverlay($('#producto-modal'));
}
function agregarItem(id,varianteId){
 const p=PRODUCTOS.find(p=>p.id===id);
 if(!p || p.proximamente)return;
 const variante=varianteDe(p,varianteId),key=`${p.id}::${variante.id}`;
 const encontrado=carrito.find(i=>i.key===key);
 if(encontrado) encontrado.cantidad=Math.min(99,encontrado.cantidad+1);
 else carrito.push({key,id:p.id,varianteId:variante.id,cantidad:1});
 persistir();toast('✅ ¡Agregado a tu carrito!');
}
function modificarCantidad(key,delta){const item=carrito.find(i=>i.key===key);if(!item)return;item.cantidad+=delta;if(item.cantidad<=0)carrito=carrito.filter(i=>i.key!==key);item.cantidad=Math.min(99,item.cantidad);persistir();renderCarrito();}
function borrarItem(key){carrito=carrito.filter(i=>i.key!==key);persistir();renderCarrito();}
function regalosGratis(){return carrito.reduce((n,i)=>{const p=PRODUCTOS.find(p=>p.id===i.id);const v=varianteDe(p,i.varianteId);return n+(p?.marca==='TUKI' && p?.categoria==='mascotas' && v?.palaGratis?i.cantidad:0);},0);}
function subtotal(){return carrito.reduce((n,i)=>{const p=PRODUCTOS.find(p=>p.id===i.id);return n+(varianteDe(p,i.varianteId)?.precio||0)*i.cantidad;},0);}
function renderCarrito(){
  $('#cart-empty').hidden=carrito.length>0;
  $('#checkout').hidden=carrito.length===0;
  $('#cart-items').innerHTML=carrito.map(i=>{
    const p=PRODUCTOS.find(p=>p.id===i.id),v=varianteDe(p,i.varianteId);if(!p||!v)return '';
    return `<div class="cart-item"><img alt="${safe(p.nombre)}" src="${safe(v.imagen||p.imagen)}" /><div><h4>${safe(p.nombre)}</h4><small>${safe(v.nombre)}</small><strong>${dinero(v.precio*i.cantidad)}</strong><div class="quantity"><button aria-label="Disminuir cantidad de ${safe(p.nombre)}" data-quantity="-1" data-key="${safe(i.key)}">−</button><span>${i.cantidad}</span><button aria-label="Aumentar cantidad de ${safe(p.nombre)}" data-quantity="1" data-key="${safe(i.key)}">+</button></div></div><button class="cart-remove" title="Eliminar" aria-label="Eliminar ${safe(p.nombre)}" data-remove="${safe(i.key)}">×</button></div>`;
  }).join('');
  $('#cart-subtotal').textContent=dinero(subtotal());
  const regalos=regalosGratis();$('#gift-message').hidden=regalos===0;$('#gift-detail').textContent=`${regalos} pala${regalos===1?'':'s'} sanitaria${regalos===1?'':'s'} gratis por arena de 25 kg. Sujeto a stock y confirmación.`;
}
function sincronizarEntrega(){const isDelivery=$('#modo-entrega').value==='delivery';$('#direccion-box').hidden=!isDelivery;$('#recojo-box').hidden=isDelivery;$('#cliente-direccion').required=isDelivery;}
function finalizarPedido(event){
 event.preventDefault();
 $('#form-error').hidden=true;
 const nombre=$('#cliente-nombre').value.trim();const telefono=$('#cliente-telefono').value.trim();const modo=$('#modo-entrega').value;const direccion=$('#cliente-direccion').value.trim();const hora=$('#cliente-hora').value;const pago=$('#pago').value;const notas=$('#cliente-comentarios').value.trim();
 function error(msg,elem){const el=$('#form-error');el.textContent=msg;el.hidden=false;elem?.focus();return;}
 if(!carrito.length)return error('Agrega al menos un artículo al carrito.');
 if(nombre.length<2)return error('Escribe el nombre de quien recibirá el pedido.',$('#cliente-nombre'));
 if(modo==='delivery' && direccion.length<7)return error('Ingresa tu dirección, número y distrito para solicitar delivery.',$('#cliente-direccion'));
 const modalidad={delivery:'Envío a domicilio',recojo:'Recojo coordinado en tienda',preparar:'Preparar para recojo'}[modo];
 const lineas=[`🛍️ *PEDIDO DESDE TUKI*`,'',`👤 *Cliente:* ${nombre}`,telefono?`📱 *Celular:* ${telefono}`:null,`📦 *Modalidad:* ${modalidad}`,modo==='delivery'?`📍 *Dirección:* ${direccion}`:'📍 *Punto de recojo:* Por confirmar con la tienda',modo!=='delivery' && hora?`🕒 *Fecha y hora solicitadas:* ${hora.replace('T',' ')}`:null,`💳 *Pago preferido:* ${pago}`,'',`*PRODUCTOS Y SERVICIOS:*`];
 carrito.forEach((i,idx)=>{const p=PRODUCTOS.find(p=>p.id===i.id),v=varianteDe(p,i.varianteId);lineas.push(`${idx+1}. ${p.nombre} — ${v.nombre}`,`   ${i.cantidad} × ${dinero(v.precio)} = *${dinero(i.cantidad*v.precio)}*`);});
 const regalos=regalosGratis();if(regalos)lineas.push('',`🎁 *Promoción:* ${regalos} pala(s) sanitaria(s) GRATIS por arena de 25 kg, sujeta(s) a stock.`);
 lineas.push('',`💰 *Subtotal referencial:* ${dinero(subtotal())}`,`⚠ *Importante:* precios, stock, envío, promociones y total final sujetos a confirmación.`);
 if(notas)lineas.push('',`📝 *Comentarios:* ${notas}`);
 lineas.push('','¡Hola! Quisiera confirmar mi pedido, por favor.');
 abrirWhatsapp(lineas.filter(l=>l!==null).join('\n'));
 toast('📲 Pedido preparado: revisa WhatsApp para enviarlo.');
}
function setup(){
  $('#anio').textContent=new Date().getFullYear();
  actualizarContador();renderProductos();sincronizarEntrega();
  $$('#filter-tabs .filter-tab').forEach(button=>button.addEventListener('click',()=>aplicarFiltro(button.dataset.filter,false)));
  $('#ordenar').addEventListener('change',e=>{orden=e.target.value;renderProductos();});
  $('#buscar').addEventListener('input',e=>{busqueda=e.target.value;$('#limpiar-busqueda').hidden=!busqueda;renderProductos();});
  $('#buscar').addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();$('#catalogo').scrollIntoView({behavior:'smooth'});}});
  $('#limpiar-busqueda').addEventListener('click',()=>{busqueda='';$('#buscar').value='';$('#limpiar-busqueda').hidden=true;renderProductos();$('#buscar').focus();});
  $('#restablecer').addEventListener('click',limpiarFiltros);
  $('#vaciar-filtros').addEventListener('click',limpiarFiltros);
  $('#solo-favoritos').addEventListener('click',()=>{soloFavoritos=!soloFavoritos;$('#solo-favoritos').classList.toggle('is-active',soloFavoritos);$('#solo-favoritos').setAttribute('aria-pressed',String(soloFavoritos));renderProductos();$('#catalogo').scrollIntoView({behavior:'smooth'});});
  document.addEventListener('click',event=>{
    const fav=event.target.closest('[data-fav]');if(fav){const id=fav.dataset.fav;favoritos=favoritos.includes(id)?favoritos.filter(x=>x!==id):[...favoritos,id];storageSet('tuki_favoritos_v1',favoritos);renderProductos();return;}
    const open=event.target.closest('[data-open-product]');if(open){abrirProducto(open.dataset.openProduct);return;}
    const plus=event.target.closest('[data-quantity]');if(plus){modificarCantidad(plus.dataset.key,Number(plus.dataset.quantity));return;}
    const del=event.target.closest('[data-remove]');if(del){borrarItem(del.dataset.remove);return;}
    if(event.target.closest('[data-open-cart]')){abrirCarrito();return;}
    if(event.target.closest('[data-close-dialog]')||event.target.id==='overlay'){cerrarDialogos();return;}
    const cat=event.target.closest('[data-go-category]');if(cat){if(cat.dataset.goCategory==='mascotas'||cat.dataset.goCategory==='lavanderia'){aplicarFiltro(cat.dataset.goCategory,false);}else{aplicarFiltro(cat.dataset.goCategory,false);if(cat.getAttribute('href')==='#futuro')return;}return;}
    const promo=event.target.closest('[data-promo]');if(promo){if(!promoVigente())return toast('Esta promoción de octubre de 2026 ya finalizó.');abrirWhatsapp(`Hola, soy cliente de TUKI. ${promo.dataset.promo}. ¿Está disponible?`);}
  });
  $('#overlay').addEventListener('click',cerrarDialogos);
  document.addEventListener('keydown',e=>{if(e.key==='Escape')cerrarDialogos();});
  $('#modo-entrega').addEventListener('change',sincronizarEntrega);
  $('#checkout-form').addEventListener('submit',finalizarPedido);
  $('#aviso-novedades').addEventListener('click',()=>abrirWhatsapp('Hola, vengo de la web TUKI. Quisiera recibir información cuando se lance la nueva línea de hogar y NÉVORA Skin.'));
  $('#mobile-toggle').addEventListener('click',()=>{const nav=$('#mobile-nav');nav.hidden=!nav.hidden;$('#mobile-toggle').setAttribute('aria-expanded',String(!nav.hidden));});
  $$('#mobile-nav a').forEach(a=>a.addEventListener('click',()=>{$('#mobile-nav').hidden=true;$('#mobile-toggle').setAttribute('aria-expanded','false');}));
  if(!promoVigente()){const label=$('#promo-status');label.classList.add('expired');label.textContent='Promoción de octubre 2026 finalizada'; $$('.promo-card .link-action').forEach(button=>{button.textContent='Promoción finalizada';button.disabled=true;button.style.opacity='.5';button.style.cursor='not-allowed';});}
  // Error visual legible en lugar del icono de imagen rota. El catálogo seguirá funcionando.
  document.addEventListener('error',e=>{if(e.target.tagName==='IMG'&&!e.target.dataset.fallback){e.target.dataset.fallback='true';e.target.src='img/productos/imagen-pendiente.svg';}},true);
}
setup();
