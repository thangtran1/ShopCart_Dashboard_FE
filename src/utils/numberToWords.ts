export function numberToVietnameseText(n: number): string {
  if (n === 0) return 'Không đồng';
  if (!n || isNaN(n)) return '';

  const units = ['', 'nghìn', 'triệu', 'tỷ', 'nghìn tỷ', 'triệu tỷ'];
  const numbers = ['không', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín'];

  function readThreeDigits(n: number, isFirst: boolean): string {
    let str = '';
    const hundred = Math.floor(n / 100);
    n = n % 100;
    const ten = Math.floor(n / 10);
    const unit = n % 10;

    if (hundred > 0 || !isFirst) {
      str += numbers[hundred] + ' trăm ';
      if (ten === 0 && unit > 0) {
        str += 'lẻ ';
      }
    }

    if (ten === 1) {
      str += 'mười ';
    } else if (ten > 1) {
      str += numbers[ten] + ' mươi ';
    }

    if (unit === 1 && ten > 1) {
      str += 'mốt ';
    } else if (unit === 5 && ten > 0) {
      str += 'lăm ';
    } else if (unit > 0) {
      str += numbers[unit] + ' ';
    }

    return str.trim();
  }

  let str = '';
  let unitIndex = 0;

  let tempNum = n;
  while (tempNum > 0) {
    const batch = tempNum % 1000;
    tempNum = Math.floor(tempNum / 1000);

    if (batch > 0) {
      const isFirst = tempNum === 0;
      const batchStr = readThreeDigits(batch, isFirst) + ' ' + units[unitIndex];
      str = batchStr.trim() + ' ' + str;
    }
    unitIndex++;
  }

  str = str.trim().replace(/\s+/g, ' ');
  return str.charAt(0).toUpperCase() + str.slice(1) + ' đồng';
}
