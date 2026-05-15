```jsx
//CSS conditionnelle
<td
    style={{
        color:
            order.status === "completed"
                ? "green"
                : order.status === "pending"
                ? "orange"
                : "#666"
    }}
    >
    {order.status}
</td>
```