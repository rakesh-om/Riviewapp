// import React, { useEffect, useRef, useState } from "react";
// import { Card, Box, Text, Modal, Button } from "@shopify/polaris";



// function StarSVG({ color = "#FBBF24", size = 14 }) {
//   return (
//     <svg
//       width={size}
//       height={size}
//       viewBox="0 0 24 24"
//       style={{ marginRight: 4, display: "inline-block", verticalAlign: "middle" }}
//       aria-hidden="true"
//       focusable="false"
//       role="img"
//     >
//       <path
//         fill={color}
//         d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77 6.82 21.02 8 14.14 3 9.27l6.91-1.01L12 2z"
//       />
//     </svg>
//   );
// }

// export default function ScrollPreview({ settings = {} }) {
//   const heading = settings.review_heading || "Customer Reviews";
//   const starColor = settings.star_color || "#FBBF24";
//   const cardBg = settings.card_bg_color || "#ffffff";
//   const cardText = settings.text_color || "#111827";
//   const desktopCards = Math.max(1, Math.min(5, settings.desktop_cards || 3));

//   const containerRef = useRef(null);
//   const [reviews, setReviews] = useState([]);
//   const [index, setIndex] = useState(0); // current slide index
//   const [slidesPerView, setSlidesPerView] = useState(1);
//   const [isDragging, setIsDragging] = useState(false);
//   const dragStartX = useRef(0);
//   const dragDeltaX = useRef(0);
//   const [readMore, setReadMore] = useState({}); // expanded comments
//   const [modal, setModal] = useState({ open: false, images: [], idx: 0 });

//   // Try relative API first, then fallback to localhost
//   const apiCandidates = ["/api/reviews", "http://localhost:5000/api/reviews"];

//   useEffect(() => {
//     let cancelled = false;

//     async function fetchReviews() {
//       for (const url of apiCandidates) {
//         try {
//           const res = await fetch(url, { method: "GET", headers: { Accept: "application/json" } });
//           if (!res.ok) continue;
//           const data = await res.json();
//           if (!cancelled && Array.isArray(data.reviews) && data.reviews.length > 0) {
//             setReviews(data.reviews);
//             setIndex(0);
//             return;
//           }
//         } catch (e) {
//           // try next candidate
//         }
//       }

//       // fallback sample data if none found
//       if (!cancelled) {
//         setReviews([
//           { name: "Jessica A", rating: 5, comment: "Amazing product! Fast shipping.", images: [], profileImage: "https://i.pravatar.cc/100?img=12", date: "2025-11-01" },
//           { name: "Mark T", rating: 5, comment: "I love this so much! Highly recommend.", images: [], profileImage: "https://i.pravatar.cc/100?img=5", date: "2025-10-20" },
//           { name: "Chris P", rating: 4, comment: "Good quality, minor delay in delivery.", images: [], profileImage: "https://i.pravatar.cc/100?img=7", date: "2025-09-15" },
//         ]);
//       }
//     }

//     fetchReviews();
//     return () => {
//       cancelled = true;
//     };
//   }, []);

//   // compute slidesPerView on resize
//   useEffect(() => {
//     function update() {
//       const w = window.innerWidth;
//       let spv = 1;
//       if (w >= 1024) spv = desktopCards;
//       else if (w >= 768) spv = Math.min(2, desktopCards);
//       else spv = 1;
//       setSlidesPerView(spv);
//       // clamp index so it doesn't overflow
//       setIndex((i) => Math.min(i, Math.max(0, reviews.length - spv)));
//     }
//     update();
//     window.addEventListener("resize", update);
//     return () => window.removeEventListener("resize", update);
//   }, [desktopCards, reviews.length]);

//   // Auto-loop (optional): here we'll advance every 4.5s
//   useEffect(() => {
//     if (!reviews.length) return;
//     const t = setInterval(() => {
//       setIndex((i) => {
//         const maxStart = Math.max(0, reviews.length - slidesPerView);
//         if (i >= maxStart) return 0;
//         return i + 1;
//       });
//     }, 4500);
//     return () => clearInterval(t);
//   }, [reviews.length, slidesPerView]);

//   // Drag handlers
//   function onPointerDown(e) {
//     setIsDragging(true);
//     dragStartX.current = e.touches ? e.touches[0].clientX : e.clientX;
//     dragDeltaX.current = 0;
//   }
//   function onPointerMove(e) {
//     if (!isDragging) return;
//     const clientX = e.touches ? e.touches[0].clientX : e.clientX;
//     dragDeltaX.current = clientX - dragStartX.current;
//     // we could set a translate during drag but for preview we'll keep simple
//   }
//   function onPointerUp() {
//     if (!isDragging) return setIsDragging(false);
//     const threshold = (containerRef.current?.offsetWidth || 300) * 0.15;
//     if (dragDeltaX.current > threshold) {
//       // swipe right -> prev
//       setIndex((i) => Math.max(0, i - 1));
//     } else if (dragDeltaX.current < -threshold) {
//       // swipe left -> next
//       setIndex((i) => {
//         const maxStart = Math.max(0, reviews.length - slidesPerView);
//         if (i >= maxStart) return 0;
//         return i + 1;
//       });
//     }
//     setIsDragging(false);
//     dragDeltaX.current = 0;
//   }

//   function openGallery(images = [], startIdx = 0) {
//     if (!images || images.length === 0) return;
//     setModal({ open: true, images, idx: startIdx });
//   }
//   function closeGallery() {
//     setModal({ open: false, images: [], idx: 0 });
//   }
//   function prevImage() {
//     setModal((m) => ({ ...m, idx: (m.idx - 1 + m.images.length) % m.images.length }));
//   }
//   function nextImage() {
//     setModal((m) => ({ ...m, idx: (m.idx + 1) % m.images.length }));
//   }

//   const trackWidthPercent = (reviews.length > 0) ? (100 * (reviews.length / slidesPerView)) : 100;
//   const translateXPercent = -(index * (100 / reviews.length || 100)) * slidesPerView / slidesPerView; // simplified

//   // We'll calculate slide width in percent:
//   const slideWidthPercent = reviews.length ? 100 / slidesPerView : 100;

//   return (
//     <Card>
//       <Box padding="4">
//         <Text variant="headingMd" as="h3" fontWeight="semibold">
//           {heading} — Carousel Preview
//         </Text>

//         <div
//           ref={containerRef}
//           style={{
//             marginTop: 12,
//             overflow: "hidden",
//             position: "relative",
//             touchAction: "pan-y",
//             userSelect: isDragging ? "none" : "auto",
//           }}
//           onMouseDown={onPointerDown}
//           onMouseMove={onPointerMove}
//           onMouseUp={onPointerUp}
//           onMouseLeave={() => isDragging && onPointerUp()}
//           onTouchStart={onPointerDown}
//           onTouchMove={onPointerMove}
//           onTouchEnd={onPointerUp}
//         >
//           {/* Track */}
//           <div
//             style={{
//               display: "flex",
//               width: `${(reviews.length / slidesPerView) * 100}%`,
//               transform: `translateX(-${(index * (100 / slidesPerView))}%)`,
//               transition: isDragging ? "none" : "transform 420ms cubic-bezier(.2,.9,.2,1)",
//             }}
//           >
//             {reviews.map((r, idx) => (
//               <div
//                 key={idx}
//                 style={{
//                   width: `${slideWidthPercent}%`,
//                   padding: 12,
//                   boxSizing: "border-box",
//                 }}
//               >
//                 <div
//                   style={{
//                     background: cardBg,
//                     color: cardText,
//                     padding: 16,
//                     borderRadius: 12,
//                     minHeight: 160,
//                     display: "flex",
//                     flexDirection: "column",
//                     justifyContent: "space-between",
//                     boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
//                     border: "1px solid rgba(0,0,0,0.04)",
//                     height: "100%",
//                   }}
//                 >
//                   <div>
//                     <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
//                       <img
//                         src={r.profileImage || "https://i.pravatar.cc/100?img=1"}
//                         alt={r.name || "Customer"}
//                         style={{
//                           width: 48,
//                           height: 48,
//                           borderRadius: 24,
//                           objectFit: "cover",
//                           background: "#eee",
//                           flexShrink: 0,
//                         }}
//                       />
//                       <div>
//                         <div style={{ fontWeight: 700, color: cardText }}>{r.name || "Anonymous"}</div>
//                         <div style={{ display: "flex", alignItems: "center" }}>
//                           {Array.from({ length: 5 }).map((_, i) => (
//                             <StarSVG key={i} color={i < (r.rating || 0) ? starColor : "#e6e6e6"} size={12} />
//                           ))}
//                         </div>
//                       </div>
//                     </div>

//                     <p style={{ marginTop: 12, color: cardText, lineHeight: 1.5 }}>
//                       {(() => {
//                         const words = (r.comment || "").split(/\s+/);
//                         const needs = words.length > 20;
//                         const expanded = !!readMore[idx];
//                         if (expanded) {
//                           return (
//                             <>
//                               {r.comment}{" "}
//                               {needs && (
//                                 <button
//                                   onClick={() => setReadMore((s) => ({ ...s, [idx]: false }))}
//                                   style={{ color: "#0066cc", border: "none", background: "none", cursor: "pointer", fontWeight: 600 }}
//                                 >
//                                   Read Less
//                                 </button>
//                               )}
//                             </>
//                           );
//                         } else {
//                           return (
//                             <>
//                               {words.slice(0, 20).join(" ")}
//                               {needs ? (
//                                 <>
//                                   ...{" "}
//                                   <button
//                                     onClick={() => setReadMore((s) => ({ ...s, [idx]: true }))}
//                                     style={{ color: "#0066cc", border: "none", background: "none", cursor: "pointer", fontWeight: 600 }}
//                                   >
//                                     Read More
//                                   </button>
//                                 </>
//                               ) : null}
//                             </>
//                           );
//                         }
//                       })()}
//                     </p>
//                   </div>

//                   <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
//                     <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, maxWidth: 220 }}>
//                       {(r.images || []).slice(0, 4).map((img, i) => (
//                         <img
//                           key={i}
//                           src={img}
//                           alt={`rev-${idx}-img-${i}`}
//                           style={{ width: "100%", height: 56, objectFit: "cover", borderRadius: 6, cursor: "pointer" }}
//                           onClick={() => openGallery(r.images || [], i)}
//                         />
//                       ))}
//                     </div>
//                     <div style={{ fontSize: 12, color: "#777" }}>{r.date ? new Date(r.date).toDateString() : ""}</div>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </Box>

//       {/* Modal for gallery */}
//       <Modal open={modal.open} onClose={closeGallery} title="">
//         <Modal.Section>
//           <div style={{ textAlign: "center" }}>
//             {modal.images && modal.images.length ? (
//               <>
//                 <img src={modal.images[modal.idx]} alt={`modal-${modal.idx}`} style={{ maxWidth: "100%", maxHeight: "60vh", borderRadius: 8 }} />
//                 <div style={{ marginTop: 12, display: "flex", justifyContent: "center", gap: 12 }}>
//                   <Button plain onClick={prevImage}>
//                     Prev
//                   </Button>
//                   <Button plain onClick={nextImage}>
//                     Next
//                   </Button>
//                 </div>
//               </>
//             ) : (
//               <div>No images</div>
//             )}
//           </div>
//         </Modal.Section>
//       </Modal>
//     </Card>
//   );
// }
