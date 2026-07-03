-- Pharmiperia catalog seed (generated from lib/data.ts — ADR-0001)
-- Regenerate: pnpm db:seed:generate
-- Apply: pnpm db:reset

BEGIN;

TRUNCATE TABLE product_images, order_items, favorites, reviews, products, categories, brands RESTART IDENTITY CASCADE;

-- Brands
INSERT INTO brands (id, slug, name, logo_url, country, is_featured) VALUES
  ('b1000001-0000-4000-8000-000000000001', 'bioderma', 'Bioderma', '/brands/bioderma.png', 'France', true),
  ('b1000001-0000-4000-8000-000000000002', 'vichy', 'Vichy', '/brands/vichy.png', 'France', true),
  ('b1000001-0000-4000-8000-000000000003', 'biotherm', 'Biotherm', '/brands/biotherm.png', 'France', true),
  ('b1000001-0000-4000-8000-000000000004', 'evian', 'Evian', '/brands/evian.png', 'France', true),
  ('b1000001-0000-4000-8000-000000000005', 'clinique', 'Clinique', '/brands/clinique.png', 'France', true),
  ('b1000001-0000-4000-8000-000000000006', 'nuxe', 'Nuxe', '/brands/nuxe.png', 'France', true),
  ('b1000001-0000-4000-8000-000000000007', 'avene', 'Avène', '/brands/avene.png', 'France', true),
  ('b1000001-0000-4000-8000-000000000008', 'uriage', 'Uriage', '/brands/uriage.png', 'France', true),
  ('b1000001-0000-4000-8000-000000000009', 'caudalie', 'Caudalie', '/brands/caudalie.png', 'France', true),
  ('b1000001-0000-4000-8000-00000000000a', 'la-roche-posay', 'La Roche-Posay', '/brands/la-roche-posay.png', 'France', true);

-- Categories (product taxonomy; excludes navigation-only "brands")
INSERT INTO categories (id, slug, name_ru, name_lv, sort_order) VALUES
  ('c1000001-0000-4000-8000-000000000001', 'skincare', 'Лицо', 'Seja', 1),
  ('c1000001-0000-4000-8000-000000000002', 'haircare', 'Волосы', 'Mati', 2),
  ('c1000001-0000-4000-8000-000000000003', 'bodycare', 'Тело', 'Ķermenis', 3),
  ('c1000001-0000-4000-8000-000000000004', 'sunprotection', 'Солнцезащита', 'Saules aizsardzība', 4),
  ('c1000001-0000-4000-8000-000000000005', 'makeup', 'Макияж', 'Dekoratīvā kosmētika', 5),
  ('c1000001-0000-4000-8000-000000000006', 'mencare', 'Мужчинам', 'Vīriešiem', 6),
  ('c1000001-0000-4000-8000-000000000007', 'womencare', 'Женщинам', 'Sievietēm', 7);

-- Products
INSERT INTO products (
  id, sku, slug, name_ru, name_lv, description_ru, description_lv,
  brand_id, category_id, price_cents, original_price_cents, currency, volume,
  stock_quantity, is_active, is_featured, is_bestseller, rating, review_count
) VALUES
  ('d1000001-0000-4000-8000-000000000001', '02314', 'sensibio-h2o-micellar-water-02314', 'Sensibio H2O Micellar Water', 'Sensibio H2O Micellar Water', 'Очищающая мицеллярная вода для чувствительной кожи', 'Attīroša micellu ūdens jūtīgai ādai', 'b1000001-0000-4000-8000-000000000001', 'c1000001-0000-4000-8000-000000000001', 1899, 2499, 'EUR', '500 ml', 100, true, false, true, 4.9, 87),
  ('d1000001-0000-4000-8000-000000000002', '05428', 'thermal-spring-water-spray-05428', 'Thermal Spring Water Spray', 'Thermal Spring Water Spray', 'Успокаивающий спрей с термальной водой', 'Nomierinošs tūlīšus ar termālo ūdeni', 'b1000001-0000-4000-8000-000000000007', 'c1000001-0000-4000-8000-000000000001', 1250, NULL, 'EUR', '300 ml', 100, true, true, false, 4.8, 64),
  ('d1000001-0000-4000-8000-000000000003', '01847', 'mineral-89-hyaluronic-acid-serum-01847', 'Mineral 89 Hyaluronic Acid Serum', 'Mineral 89 Hyaluronic Acid Serum', 'Увлажняющая сыворотка с гиалуроновой кислотой', 'Mitrinošs serums ar hialuronu skābi', 'b1000001-0000-4000-8000-000000000002', 'c1000001-0000-4000-8000-000000000001', 2995, 3700, 'EUR', '50 ml', 100, true, true, false, 4.8, 52),
  ('d1000001-0000-4000-8000-000000000004', '03561', 'proactive-anti-aging-serum-03561', 'Proactive Anti-Aging Serum', 'Proactive Anti-Aging Serum', 'Активная сыворотка против старения кожи', 'Aktīvs serums pret ādas novecošanu', 'b1000001-0000-4000-8000-000000000003', 'c1000001-0000-4000-8000-000000000001', 4900, 6200, 'EUR', '30 ml', 100, true, false, false, 4.7, 31),
  ('d1000001-0000-4000-8000-000000000005', '04112', 'moisture-surge-100h-moisturizer-04112', 'Moisture Surge 100H Moisturizer', 'Moisture Surge 100H Moisturizer', 'Увлажняющий крем на 100 часов', 'Mitrinošs krēms uz 100 stundam', 'b1000001-0000-4000-8000-000000000005', 'c1000001-0000-4000-8000-000000000001', 4200, NULL, 'EUR', '50 ml', 100, true, false, false, 4.6, 45),
  ('d1000001-0000-4000-8000-000000000006', '02891', 'huile-prodigieuse-dry-oil-02891', 'Huile Prodigieuse Dry Oil', 'Huile Prodigieuse Dry Oil', 'Универсальное сухое масло для лица и тела', 'Universāls sausais eļļas sejas un ķermenim', 'b1000001-0000-4000-8000-000000000006', 'c1000001-0000-4000-8000-000000000003', 3495, 4200, 'EUR', '100 ml', 100, true, false, true, 4.9, 118),
  ('d1000001-0000-4000-8000-000000000007', '03725', 'reve-de-miel-lip-balm-03725', 'Reve de Miel Lip Balm', 'Reve de Miel Lip Balm', 'Питательный бальзам для губ с медом', 'Barīgs lūpu balzams ar medu', 'b1000001-0000-4000-8000-000000000006', 'c1000001-0000-4000-8000-000000000005', 999, NULL, 'EUR', '15 g', 100, true, true, false, 4.8, 96),
  ('d1000001-0000-4000-8000-000000000008', '04506', 'capital-soleil-spf-50-face-fluid-04506', 'Capital Soleil SPF 50+ Face Fluid', 'Capital Soleil SPF 50+ Face Fluid', 'Солнцезащитный флюид для лица SPF 50+', 'Saules aizsardzības šķidrums sejai SPF 50+', 'b1000001-0000-4000-8000-000000000002', 'c1000001-0000-4000-8000-000000000004', 2250, NULL, 'EUR', '40 ml', 100, true, false, false, 4.7, 38),
  ('d1000001-0000-4000-8000-000000000009', '02619', 'sensibio-light-soothing-cream-02619', 'Sensibio Light Soothing Cream', 'Sensibio Light Soothing Cream', 'Успокаивающий легкий крем для чувствительной кожи', 'Nomierinošs viegls krēms jūtīgai ādai', 'b1000001-0000-4000-8000-000000000001', 'c1000001-0000-4000-8000-000000000001', 2199, 2700, 'EUR', '40 ml', 100, true, false, false, 4.7, 41),
  ('d1000001-0000-4000-8000-00000000000a', '05134', 'thermal-spring-water-facial-mist-05134', 'Thermal Spring Water Facial Mist', 'Thermal Spring Water Facial Mist', 'Успокаивающий спрей с термальной водой Эвиана', 'Nomierinošs tūlīšus ar Eviānas termālo ūdeni', 'b1000001-0000-4000-8000-000000000004', 'c1000001-0000-4000-8000-000000000001', 899, NULL, 'EUR', '50 ml', 100, true, false, false, 4.5, 19),
  ('d1000001-0000-4000-8000-00000000000b', '03892', 'life-plankton-essence-03892', 'Life Plankton Essence', 'Life Plankton Essence', 'Питающая эссенция с морским планктоном', 'Barojošs esence ar jūras planktoniem', 'b1000001-0000-4000-8000-000000000003', 'c1000001-0000-4000-8000-000000000001', 6800, 8200, 'EUR', '175 ml', 100, true, false, false, 4.8, 27),
  ('d1000001-0000-4000-8000-00000000000c', '01423', 'eau-thermale-gentle-cleansing-gel-01423', 'Eau Thermale Gentle Cleansing Gel', 'Eau Thermale Gentle Cleansing Gel', 'Мягкий гель для очищения с термальной водой', 'Maigs tīrīšanas gels ar termālo ūdeni', 'b1000001-0000-4000-8000-000000000007', 'c1000001-0000-4000-8000-000000000001', 1495, NULL, 'EUR', '200 ml', 100, true, false, false, 4.6, 73),
  ('d1000001-0000-4000-8000-00000000000d', '04718', 'dercos-anti-dandruff-shampoo-200ml-04718', 'Dercos Anti-Dandruff Shampoo 200ml', 'Dercos Anti-Dandruff Shampoo 200ml', 'Дерматологический шампунь против перхоти для ежедневного применения', 'Dermatologiskais šampūns pret blaugznām ikdienas lietošanai', 'b1000001-0000-4000-8000-000000000002', 'c1000001-0000-4000-8000-000000000002', 1750, 2200, 'EUR', '200 ml', 100, true, false, false, 4.6, 56),
  ('d1000001-0000-4000-8000-00000000000e', '05136', 'aquasource-gel-moisturizer-50ml-05136', 'Aquasource Gel Moisturizer 50ml', 'Aquasource Gel Moisturizer 50ml', 'Лёгкий гель-крем для интенсивного увлажнения нормальной и сухой кожи', 'Viegls želejas krēms intensīvai mitrināšanai normālai un sausai ādai', 'b1000001-0000-4000-8000-000000000003', 'c1000001-0000-4000-8000-000000000001', 3900, NULL, 'EUR', '50 ml', 100, true, false, false, 4.5, 22),
  ('d1000001-0000-4000-8000-00000000000f', '03904', 'atoderm-intensive-baume-500ml-03904', 'Atoderm Intensive Baume 500ml', 'Atoderm Intensive Baume 500ml', 'Восстанавливающий бальзам для очень сухой и атопичной кожи тела', 'Atjaunojošs balzams ļoti sausai un atopiskai ķermeņa ādai', 'b1000001-0000-4000-8000-000000000001', 'c1000001-0000-4000-8000-000000000003', 2699, 3300, 'EUR', '500 ml', 100, true, true, false, 4.8, 104),
  ('d1000001-0000-4000-8000-000000000010', '04287', 'dramatically-different-moisturizing-lotion-125ml-04287', 'Dramatically Different Moisturizing Lotion 125ml', 'Dramatically Different Moisturizing Lotion 125ml', 'Культовый увлажняющий лосьон для укрепления кожного барьера', 'Kultais mitrinošais losjons ādas barjeras stiprināšanai', 'b1000001-0000-4000-8000-000000000005', 'c1000001-0000-4000-8000-000000000001', 3500, NULL, 'EUR', '125 ml', 100, true, false, false, 4.7, 68);

-- Product images
INSERT INTO product_images (id, product_id, image_url, sort_order, is_primary) VALUES
  ('e1000001-0000-4000-8000-00000000000a', 'd1000001-0000-4000-8000-000000000001', 'https://images.unsplash.com/photo-1693990437506-dac9d69697a9?w=800&h=800&fit=crop&auto=format&q=85&bg=ffffff', 0, true),
  ('e1000001-0000-4000-8000-00000000000b', 'd1000001-0000-4000-8000-000000000001', 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800&h=800&fit=crop&auto=format&q=85&bg=ffffff', 1, false),
  ('e1000001-0000-4000-8000-000000000014', 'd1000001-0000-4000-8000-000000000002', 'https://images.unsplash.com/photo-1639112389900-a858bf671be1?w=800&h=800&fit=crop&auto=format&q=85&bg=ffffff', 0, true),
  ('e1000001-0000-4000-8000-00000000001e', 'd1000001-0000-4000-8000-000000000003', 'https://images.unsplash.com/photo-1556228721-e65f06ab45c8?w=800&h=800&fit=crop&auto=format&q=85&bg=ffffff', 0, true),
  ('e1000001-0000-4000-8000-00000000001f', 'd1000001-0000-4000-8000-000000000003', 'https://images.unsplash.com/photo-1556227834-09f1de7a7d14?w=800&h=800&fit=crop&auto=format&q=85&bg=ffffff', 1, false),
  ('e1000001-0000-4000-8000-000000000028', 'd1000001-0000-4000-8000-000000000004', 'https://images.unsplash.com/photo-1556227834-09f1de7a7d14?w=800&h=800&fit=crop&auto=format&q=85&bg=ffffff', 0, true),
  ('e1000001-0000-4000-8000-000000000032', 'd1000001-0000-4000-8000-000000000005', 'https://images.unsplash.com/photo-1640967378425-50dbf90aee8a?w=800&h=800&fit=crop&auto=format&q=85&bg=ffffff', 0, true),
  ('e1000001-0000-4000-8000-00000000003c', 'd1000001-0000-4000-8000-000000000006', 'https://images.unsplash.com/photo-1696894756299-345f1c0feb00?w=800&h=800&fit=crop&auto=format&q=85&bg=ffffff', 0, true),
  ('e1000001-0000-4000-8000-000000000046', 'd1000001-0000-4000-8000-000000000007', 'https://images.unsplash.com/photo-1693990437531-720851467ffe?w=800&h=800&fit=crop&auto=format&q=85&bg=ffffff', 0, true),
  ('e1000001-0000-4000-8000-000000000050', 'd1000001-0000-4000-8000-000000000008', 'https://images.unsplash.com/photo-1707555647418-627729a66329?w=800&h=800&fit=crop&auto=format&q=85&bg=ffffff', 0, true),
  ('e1000001-0000-4000-8000-00000000005a', 'd1000001-0000-4000-8000-000000000009', 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800&h=800&fit=crop&auto=format&q=85&bg=ffffff', 0, true),
  ('e1000001-0000-4000-8000-000000000064', 'd1000001-0000-4000-8000-00000000000a', 'https://images.unsplash.com/photo-1694101455025-bc2f91667841?w=800&h=800&fit=crop&auto=format&q=85&bg=ffffff', 0, true),
  ('e1000001-0000-4000-8000-00000000006e', 'd1000001-0000-4000-8000-00000000000b', 'https://images.unsplash.com/photo-1699373384241-06b627ae2c8c?w=800&h=800&fit=crop&auto=format&q=85&bg=ffffff', 0, true),
  ('e1000001-0000-4000-8000-000000000078', 'd1000001-0000-4000-8000-00000000000c', 'https://images.unsplash.com/photo-1701992678972-d5a053ad0fb0?w=800&h=800&fit=crop&auto=format&q=85&bg=ffffff', 0, true),
  ('e1000001-0000-4000-8000-000000000082', 'd1000001-0000-4000-8000-00000000000d', 'https://images.unsplash.com/photo-1701992678972-d5a053ad0fb0?w=800&h=800&fit=crop&auto=format&q=85&bg=ffffff', 0, true),
  ('e1000001-0000-4000-8000-00000000008c', 'd1000001-0000-4000-8000-00000000000e', 'https://images.unsplash.com/photo-1704297004675-bf0ef33713e4?w=800&h=800&fit=crop&auto=format&q=85&bg=ffffff', 0, true),
  ('e1000001-0000-4000-8000-000000000096', 'd1000001-0000-4000-8000-00000000000f', 'https://images.unsplash.com/photo-1697201358649-ca8e6ecc3ac0?w=800&h=800&fit=crop&auto=format&q=85&bg=ffffff', 0, true),
  ('e1000001-0000-4000-8000-0000000000a0', 'd1000001-0000-4000-8000-000000000010', 'https://images.unsplash.com/photo-1693990437506-dac9d69697a9?w=800&h=800&fit=crop&auto=format&q=85&bg=ffffff', 0, true);

COMMIT;
