
SELECT T.id, td.text
FROM coach.Time T
LEFT JOIN coach.Repeat R ON R.idEndRepeat = T.id
JOIN _RepeatToTodo rttd
	ON rttd.A = r.id
JOIN Todo td
	ON td.id = rttd.B
WHERE T.id in (410, 414, 418, 422, 402, 430, 406, 458, 438, 434, 442, 450, 446)
ORDER BY td.id;

-- DELETE FROM Time T
-- WHERE T.id in (394, 410, 414, 418, 422, 402, 430, 406, 458, 438, 434, 442, 450, 446)