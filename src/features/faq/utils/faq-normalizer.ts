import type { Faq, FaqCategory, FaqRawItem } from "@/types/api.types";

export interface NormalizedFaqData {
  faqs: Faq[];
  categories: FaqCategory[];
}

function isFaqItem(item: FaqRawItem): item is Faq {
  return (
    "question" in item &&
    typeof item.question === "string" &&
    "answer" in item &&
    typeof item.answer === "string"
  );
}

function isFaqCategoryItem(item: FaqRawItem): item is FaqCategory {
  return (
    !("question" in item) &&
    "name" in item &&
    typeof item.name === "string" &&
    "slug" in item &&
    typeof item.slug === "string"
  );
}

function addCategoryIfMissing(
  map: Map<string, FaqCategory>,
  cat?: FaqCategory | null
): void {
  if (!cat?.slug || !cat.name) {
    return;
  }
  if (!map.has(cat.slug)) {
    map.set(cat.slug, {
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      order: cat.order ?? 0,
    });
  }
}

function extractNestedFaqs(
  cat: FaqCategory,
  seenFaqIds: Set<number>,
  faqList: Faq[]
): void {
  if (!Array.isArray(cat.faqs)) {
    return;
  }

  for (const nested of cat.faqs) {
    if (
      typeof nested === "object" &&
      isFaqItem(nested) &&
      !seenFaqIds.has(nested.id)
    ) {
      seenFaqIds.add(nested.id);
      faqList.push({
        ...nested,
        faq_category_id: nested.faq_category_id ?? cat.id,
        category: nested.category ?? {
          id: cat.id,
          name: cat.name,
          slug: cat.slug,
        },
      });
    }
  }
}

export function normalizeFaqResponse(rawItems: FaqRawItem[]): NormalizedFaqData {
  const faqList: Faq[] = [];
  const seenFaqIds = new Set<number>();
  const categoryMap = new Map<string, FaqCategory>();

  for (const item of rawItems) {
    if (isFaqItem(item)) {
      if (!seenFaqIds.has(item.id)) {
        seenFaqIds.add(item.id);
        faqList.push(item);
      }
      addCategoryIfMissing(categoryMap, item.category);
    } else if (isFaqCategoryItem(item)) {
      addCategoryIfMissing(categoryMap, item);
      extractNestedFaqs(item, seenFaqIds, faqList);
    }
  }

  faqList.sort((a, b) => (a.order || 0) - (b.order || 0));
  const categories = Array.from(categoryMap.values()).sort(
    (a, b) => (a.order ?? 0) - (b.order ?? 0)
  );

  return { faqs: faqList, categories };
}
