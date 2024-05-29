import matplotlib.pyplot as plt

# Parameters
maxEmission = 336000000  # total guac coins in faucet
curveParam = 5000          # Increase the curve parameter for a steeper fall-off
clicks = 1000000           # Number of clicks to simulate

#claimInterval = 1        # Example claim interval in days

# Simulation variables
totalClaimed = 0
claimAmounts = []      # Store claim amounts per click
totalClaimedAmounts = [] # Store total claimed after each click

for click in range(clicks):
    if totalClaimed < maxEmission:
        remainingSupply = maxEmission - totalClaimed
        claimAmount = (remainingSupply * curveParam / maxEmission) * 1  # Assuming '1' GUAC per claim for simplicity
        totalClaimed += claimAmount
    else:
        claimAmount = 0
    
    claimAmounts.append(claimAmount)
    totalClaimedAmounts.append(totalClaimed)

# Plotting
plt.figure(figsize=(12, 6))

# Claimable Amount vs Clicks
plt.subplot(1, 2, 1)
plt.plot(range(clicks), claimAmounts, label='Claimable Amount per Click')
plt.title('Claimable $GUAC Amount Per Click')
plt.xlabel('Clicks')
plt.ylabel('Claimable $GUAC Amount (per click)')
plt.grid(True)
plt.legend()

plt.text(clicks*0.5, max(claimAmounts)*0.9, f'Curve Parameter: {curveParam}', horizontalalignment='center')


# Total Claimed vs Clicks
plt.subplot(1, 2, 2)
plt.plot(range(clicks), totalClaimedAmounts, label='Total $GUAC Claimed', color='orange')
plt.title('Total $GUAC Claimed Emission Curve (vs Clicks)')
plt.xlabel('Clicks')
plt.ylabel('Total $GUAC Claimed')
plt.grid(True)
plt.legend()

plt.tight_layout()
plt.show()
